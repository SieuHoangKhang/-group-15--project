// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET danh sách người dùng
router.get('/users', userController.getUsers);

// POST tạo người dùng mới
router.post('/users', userController.createUser);

// PUT cập nhật người dùng theo id
router.put('/users/:id', userController.updateUser);

// DELETE xoá người dùng theo id
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
