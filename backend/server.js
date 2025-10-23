// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const mongoose = require('mongoose'); // THÊM: Mongoose để kết nối MongoDB
require('dotenv').config();

// --- Middleware & Cấu hình ---
app.use(express.json());
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
// Theo yêu cầu bài: endpoint là /users (không có prefix /api)
app.use('/', userRouter);

// Phục vụ static frontend build (một cổng duy nhất)
// Thư mục frontend nằm tại: TH_Buoi4/frontend
const frontendBuildPath = path.join(__dirname, '..', '..', 'frontend', 'build');
app.use(express.static(frontendBuildPath));
// Catch-all: trả về index.html cho mọi route KHÔNG bắt đầu bằng /api (Express 5 dùng regex)
// Catch-all cho SPA (loại trừ /users nếu muốn, nhưng do route đã đặt trước nên không bắt vào /users)
app.get(/^\/(?!api).*/, (req, res) => {
  return res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Route gốc sẽ được file index.html xử lý SPA, không cần trả text riêng

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
// Gọi hàm kết nối database
connectDB();

// (Xóa phần app.listen cũ ở cuối file)
