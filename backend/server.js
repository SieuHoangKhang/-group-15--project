// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const mongoose = require('mongoose'); // Mongoose để kết nối MongoDB
require('dotenv').config();

// Debug: print whether CLOUDINARY_URL is present at process start
console.log('DEBUG process.env.CLOUDINARY_URL present:', !!process.env.CLOUDINARY_URL);
if (process.env.CLOUDINARY_URL) {
  try { console.log('DEBUG CLOUDINARY_URL (start):', process.env.CLOUDINARY_URL.slice(0, 60) + (process.env.CLOUDINARY_URL.length > 60 ? '...' : '')) } catch (e) {}
}

// --- Middleware & Cấu hình ---
// Tăng giới hạn body parser để chấp nhận dataURL lớn khi upload ảnh (ví dụ avatar)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Cho phép CORS từ localhost/127.0.0.1 trên mọi cổng (phục vụ dev)
app.use(cors({
  origin: (origin, callback) => {
    // Cho phép request không có origin (curl, Postman)
    if (!origin) return callback(null, true);
    const allow = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
    if (allow) return callback(null, true);
    // Nếu bạn đang debug lỗi CORS, bạn có thể tạm thời comment dòng dưới
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Import routes
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const debugRouter = require('./routes/debug');

// Mount API routers under /api to avoid SPA/static catch-all conflicts
app.use('/api', userRouter);
// Auth endpoints
app.use('/api', authRouter);
// Debug endpoints (safe diagnostics)
app.use('/api', debugRouter);

// Serve uploaded files (avatars)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Phục vụ static frontend build (một cổng duy nhất)
// Thư mục frontend nằm cạnh backend: ../frontend/build
const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuildPath));
// Catch-all: trả về index.html cho mọi route KHÔNG bắt đầu bằng /api (Express 5 dùng regex)
app.get(/^\/(?!api).*/, (req, res) => {
  return res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Khai báo cổng
const PORT = process.env.PORT || 3000;
// --- Logic Kết nối MongoDB và Khởi động Server ---
const connectDB = async () => {
  try {
    // Lấy chuỗi kết nối từ biến môi trường MONGO_URI
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Khởi động server CHỈ KHI kết nối database thành công
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy ở cổng ${PORT}`);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Lỗi: Hãy kiểm tra MONGO_URI trong file .env');
    process.exit(1); // Thoát ứng dụng nếu kết nối thất bại
  }
};

// Kết nối MongoDB và khởi động server
connectDB();

// (Xóa phần app.listen cũ ở cuối file)
