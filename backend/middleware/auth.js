const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Auth middleware: verify token, then attach basic user info (sub, email, role)
module.exports = async function auth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Thiếu token xác thực' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload should contain sub (user id) and email
    const { sub, email } = payload || {};
    if (!sub) return res.status(401).json({ message: 'Token thiếu thông tin người dùng' });
    // fetch user to get current role (avoid trusting role inside token)
    const user = await User.findById(sub).lean();
    if (!user) return res.status(401).json({ message: 'Không tìm thấy người dùng' });
  // Normalize role to lowercase to avoid case-sensitivity issues
  req.user = { sub, email, role: String(user.role || 'user').toLowerCase() };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
