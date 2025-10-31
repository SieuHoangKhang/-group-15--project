// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// GET danh sách người dùng - cho phép người dùng đã đăng nhập xem danh sách (read-only)
router.get('/users', auth, userController.getUsers);

// POST tạo người dùng mới - chỉ admin được tạo (signup nên dùng /auth/signup)
router.post('/users', auth, rbac('admin'), userController.createUser);

// PUT cập nhật người dùng theo id - chỉ admin hoặc chính chủ (self) mới được cập nhật
router.put('/users/:id', auth, userController.updateUser);

// DELETE xoá người dùng theo id (admin or self)
router.delete('/users/:id', auth, userController.deleteUser);

// Profile endpoints (GET current user, PUT update current user)
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
