// middleware/rbac.js
// Usage: rbac('admin') or rbac('admin','manager')
module.exports = function rbac(...allowedRoles) {
  // Normalize allowedRoles to lowercase for case-insensitive comparison
  const allowed = allowedRoles.map(r => String(r || '').toLowerCase());
  return function (req, res, next) {
    const user = req.user || {};
    const role = String(user.role || 'user').toLowerCase();
    if (allowed.includes(role)) return next();
    return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này' });
  };
};
