const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
// Cloudinary optional integration
let cloudinary;
try {
  cloudinary = require('cloudinary').v2;
  // If CLOUDINARY_URL is provided in env, cloudinary will pick it up.
  // We don't call cloudinary.config explicitly with secrets here to avoid leaking values in logs.
} catch (e) {
  cloudinary = null;
}

// Brevo / Sendinblue optional integration
let brevoClient = null;
try {
  const SibApiV3Sdk = require('@sendinblue/client');
  brevoClient = new SibApiV3Sdk.TransactionalEmailsApi();
  // setApiKey will be configured dynamically below if BREVO_API_KEY exists
} catch (e) {
  brevoClient = null;
}

// If cloudinary package is available but CLOUDINARY_URL is not set, try configuring
// from individual env vars (CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET).
if (cloudinary && !process.env.CLOUDINARY_URL) {
  const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET } = process.env;
  if (CLOUD_NAME && CLOUD_API_KEY && CLOUD_API_SECRET) {
    try {
      cloudinary.config({
        cloud_name: CLOUD_NAME,
        api_key: CLOUD_API_KEY,
        api_secret: CLOUD_API_SECRET,
      });
      console.log('DEBUG: cloudinary configured from CLOUD_NAME/CLOUD_API_KEY/CLOUD_API_SECRET');
    } catch (e) {
      console.error('DEBUG: cloudinary config from parts failed:', e && e.message);
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Đăng ký
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ name, email, password.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    if (existing) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hash, phone: phone || null, address: address || null });
  // Không trả password
  const { id, phone: p, address: a } = user.toJSON();
  return res.status(201).json({ id, name: user.name, email: user.email, phone: p, address: a });
  } catch (err) {
    console.error('Signup error:', err);
    if (err?.code === 11000) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và password.' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role || 'user', phone: user.phone || null, address: user.address || null }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Đăng xuất (stateless) – client xóa token
exports.logout = async (_req, res) => {
  return res.json({ message: 'Đã đăng xuất (hãy xóa token ở client).' });
};

// Lấy thông tin người dùng hiện tại từ token
exports.me = async (req, res) => {
  try {
    const { sub } = req.user || {};
    if (!sub) return res.status(401).json({ message: 'Thiếu thông tin người dùng trong token' });
    const user = await User.findById(sub);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  const { id, name, email, phone, address, avatarUrl, role } = user.toJSON();
  return res.json({ id, name, email, phone, address, avatarUrl, role });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// POST /auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Vui lòng cung cấp email' });
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(200).json({ message: 'Nếu email tồn tại, token reset sẽ được gửi.' });

    const token = crypto.randomBytes(20).toString('hex');
    user.resetToken = token;
    user.resetExpires = Date.now() + 3600 * 1000; // 1 hour
    await user.save();

    // If Brevo (Sendinblue) is configured via BREVO_API_KEY, try to send the reset email.
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const FROM_EMAIL = process.env.BREVO_FROM_EMAIL || process.env.EMAIL_FROM || 'no-reply@example.com';
    const FROM_NAME = process.env.BREVO_FROM_NAME || 'No Reply';

    if (brevoClient && BREVO_API_KEY) {
      try {
        // configure API key on the SDK ApiClient
        const SibApiV3Sdk = require('@sendinblue/client');
        SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = BREVO_API_KEY;

        const resetLink = `${FRONTEND_URL.replace(/\/$/, '')}/auth/reset-password?token=${token}`;
        const subject = 'Yêu cầu đặt lại mật khẩu';
        const htmlContent = `<p>Xin chào ${user.name || ''},</p>
          <p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn vào liên kết bên dưới để đặt lại mật khẩu (hết hạn sau 1 giờ):</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>`;

        const sendSmtpEmail = {
          sender: { name: FROM_NAME, email: FROM_EMAIL },
          to: [{ email: user.email, name: user.name || '' }],
          subject,
          htmlContent,
        };

        await brevoClient.sendTransacEmail(sendSmtpEmail);
        return res.json({ message: 'Reset token đã được gửi qua email nếu email tồn tại.' });
      } catch (err) {
        console.error('Brevo send failed:', err && err.body ? err.body : err);
        // fallthrough to return token in response for fallback/testing
      }
    }

    // Fallback: return token in response (useful for testing when email not configured)
    return res.json({ message: 'Reset token đã được tạo (trong thực tế sẽ gửi qua email).', token });
  } catch (err) {
    console.error('forgotPassword error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// POST /auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ message: 'Yêu cầu token và mật khẩu mới' });
    const user = await User.findOne({ resetToken: token, resetExpires: { $gt: Date.now() } }).select('+password +resetToken +resetExpires');
    if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;
    user.resetExpires = null;
    await user.save();
    return res.json({ message: 'Đã đặt lại mật khẩu thành công' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// POST /auth/upload-avatar
exports.uploadAvatar = async (req, res) => {
  try {
    const { sub } = req.user || {};
    if (!sub) return res.status(401).json({ message: 'Thiếu thông tin người dùng' });
    const { image } = req.body || {};
    if (!image) return res.status(400).json({ message: 'Vui lòng cung cấp trường image (data URL)' });
    // If Cloudinary is configured (CLOUDINARY_URL present), upload there.
    let avatarUrl;
    if (cloudinary && process.env.CLOUDINARY_URL) {
      try {
        // cloudinary accepts data URLs directly
        const pubId = `avatars/${sub}-${Date.now()}`;
        const uploadRes = await cloudinary.uploader.upload(image, {
          public_id: pubId,
          overwrite: true,
          resource_type: 'image',
        });
        avatarUrl = uploadRes.secure_url || uploadRes.url;
      } catch (err) {
        console.error('Cloudinary upload failed:', err);
        return res.status(500).json({ message: 'Upload lên Cloudinary thất bại' });
      }
    } else {
      // Fallback: save to local uploads folder
      const matches = image.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/);
      if (!matches) return res.status(400).json({ message: 'Image phải là data URL (png/jpg/jpeg)' });
      const ext = matches[2] === 'jpeg' ? 'jpg' : matches[2];
      const data = matches[3];
      const buffer = Buffer.from(data, 'base64');

      const uploadsDir = path.join(__dirname, '..', 'uploads', 'avatars');
      await fs.promises.mkdir(uploadsDir, { recursive: true });
      const filename = `${sub}-${Date.now()}.${ext}`;
      const filepath = path.join(uploadsDir, filename);
      await fs.promises.writeFile(filepath, buffer);

      avatarUrl = `/uploads/avatars/${filename}`;
    }

    const user = await User.findById(sub);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    user.avatarUrl = avatarUrl;
    await user.save();
    return res.json({ message: 'Upload thành công', avatarUrl });
  } catch (err) {
    console.error('uploadAvatar error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
