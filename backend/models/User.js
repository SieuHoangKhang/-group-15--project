// File: backend/models/User.js
const mongoose = require('mongoose');

// 1. Định nghĩa cấu trúc (Schema) cho User
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Loại bỏ khoảng trắng thừa
    },
    email: {
        type: String,
        required: true,
        unique: true, // Đảm bảo email không bị trùng lặp (tức là chỉ có 1 email duy nhất trong database)
        trim: true,
        lowercase: true // Lưu email dưới dạng chữ thường
    }
}, {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
});

// 2. Tạo Model từ Schema, liên kết với collection 'users'
module.exports = mongoose.model('User', UserSchema);