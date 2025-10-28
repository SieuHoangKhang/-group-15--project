// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// GET danh sách người dùng (admin only)
router.get('/users', auth, rbac('admin'), userController.getUsers);

// POST tạo người dùng mới (yêu cầu đăng nhập)
router.post('/users', auth, userController.createUser);

// PUT cập nhật người dùng theo id (protected)
router.put('/users/:id', auth, userController.updateUser);

// DELETE xoá người dùng theo id (admin or self)
router.delete('/users/:id', auth, userController.deleteUser);

// Profile endpoints (GET current user, PUT update current user)
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
