// middleware/rbac.js
// Usage: rbac('admin') or rbac('admin','manager')
module.exports = function rbac(...allowedRoles) {
  return function (req, res, next) {
    const user = req.user || {};
    const role = user.role || 'user';
    if (allowedRoles.includes(role)) return next();
    return res.status(403).json({ message: 'Bạn không có quyền truy cập tài nguyên này' });
  };
};
