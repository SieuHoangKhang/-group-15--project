// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// GET danh sách người dùng
router.get('/users', userController.getUsers);

// POST tạo người dùng mới (yêu cầu đăng nhập)
router.post('/users', auth, userController.createUser);

// PUT cập nhật người dùng theo id
router.put('/users/:id', userController.updateUser);

// DELETE xoá người dùng theo id
router.delete('/users/:id', userController.deleteUser);

// Profile endpoints (GET current user, PUT update current user)
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router;
