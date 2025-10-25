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
    },
    // Mật khẩu (được lưu dưới dạng hash). Đặt select:false để mặc định không trả về khi query
    password: {
        type: String,
        minlength: 6,
        select: false,
    }
}, {
    timestamps: true // Tự động thêm trường createdAt và updatedAt
});

// Chuẩn hoá JSON trả về: dùng 'id' thay vì '_id', bỏ __v
UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
    }
});

// 2. Tạo Model từ Schema, liên kết với collection 'users'
module.exports = mongoose.model('User', UserSchema);