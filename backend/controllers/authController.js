const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { sendResetPasswordEmail } = require('../services/emailService');
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

    // create token and expiry (15 minutes)
    const token = crypto.randomBytes(32).toString('hex');
    // store only the SHA-256 hash in DB for security
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    user.resetToken = tokenHash;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Development helper disabled for production by default.
    // We keep this code removed to avoid writing plain tokens to disk.
    // If you really need to enable storing the plain token for local debugging,
    // re-enable by setting DEV_SAVE_RESET_TOKEN and uncommenting the write logic here.

    // try to send email via service with the PLAIN token (to deliver in link)
    try {
      await sendResetPasswordEmail(user.email, token);
      return res.json({ message: 'Reset token đã được gửi qua email nếu email tồn tại.' });
    } catch (err) {
      // Log the error for diagnostics but do NOT return the plain token to the client.
      console.error('sendResetPasswordEmail failed:', err && err.body ? err.body : err);
      // Save last error to uploads for operator inspection (already present elsewhere)
      try {
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        await fs.promises.mkdir(uploadsDir, { recursive: true });
        const errPath = path.join(uploadsDir, 'brevo-last-error.txt');
        await fs.promises.writeFile(errPath, JSON.stringify(err && err.body ? err.body : err, null, 2), { encoding: 'utf8' });
      } catch (e) {
        console.error('Failed to write brevo-last-error.txt:', e && e.message ? e.message : e);
      }
      return res.json({ message: 'Nếu email tồn tại, token reset sẽ được gửi.' });
    }
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
  // hash the incoming token and look up the user by the hash
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ resetToken: tokenHash, resetTokenExpire: { $gt: Date.now() } }).select('+password +resetToken +resetTokenExpire');
    if (!user) return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetToken = null;
    user.resetTokenExpire = null;
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
