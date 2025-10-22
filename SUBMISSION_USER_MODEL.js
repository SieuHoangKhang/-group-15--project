// ========================================
// HOẠT ĐỘNG 5: TÍCH HỢP MONGODB ATLAS
// File: User.js - Model người dùng
// Vai trò: Sinh viên 3 - Backend Developer
// ========================================

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

// ========================================
// GIẢI THÍCH MODEL:
// 
// 1. name: String, required, trim
//    - Tên người dùng (bắt buộc)
//    - Tự động loại bỏ khoảng trắng đầu/cuối
//
// 2. email: String, required, unique, lowercase, trim
//    - Email người dùng (bắt buộc)
//    - Phải là duy nhất trong database
//    - Tự động chuyển về chữ thường
//    - Tự động loại bỏ khoảng trắng đầu/cuối
//
// 3. timestamps: true
//    - Tự động thêm createdAt và updatedAt
//    - Theo dõi thời gian tạo và cập nhật
//
// 4. Export model để sử dụng trong server.js
// ========================================
