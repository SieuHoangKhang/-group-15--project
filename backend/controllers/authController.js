const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Đăng ký
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đủ name, email, password.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    if (existing) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hash });
    // Không trả password
    const { id } = user.toJSON();
    return res.status(201).json({ id, name: user.name, email: user.email });
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
      user: { id: user.id, name: user.name, email: user.email }
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
    const { id, name, email } = user.toJSON();
    return res.json({ id, name, email });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
