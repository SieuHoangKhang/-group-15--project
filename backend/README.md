# Backend - MongoDB Atlas Integration

## Tổng quan
Backend API sử dụng Node.js, Express và MongoDB Atlas để quản lý dữ liệu người dùng.

## Công nghệ sử dụng
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình MongoDB Atlas
1. Làm theo hướng dẫn trong `MONGODB_SETUP.md`
2. Tạo file `.env` từ `ENV_EXAMPLE.txt`
3. Cập nhật `MONGODB_URI` với thông tin thực tế

### 3. Chạy ứng dụng
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start

# Test MongoDB connection
npm run test:mongodb
```

## API Endpoints

### GET /users
Lấy danh sách tất cả người dùng
```bash
curl http://localhost:3001/users
```

### POST /users
Tạo người dùng mới
```bash
curl -X POST http://localhost:3001/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## Cấu trúc dự án
```
backend/
├── controllers/          # API controllers
├── models/              # Mongoose models
│   └── User.js         # User model
├── routes/              # API routes
├── server.js           # Main server file
├── test-mongodb.js     # MongoDB connection test
├── .env                # Environment variables (tạo từ ENV_EXAMPLE.txt)
├── ENV_EXAMPLE.txt     # Template cho environment variables
├── MONGODB_SETUP.md    # Hướng dẫn setup MongoDB Atlas
└── package.json        # Dependencies và scripts
```

## User Model
```javascript
{
  name: String,     // Tên người dùng (required)
  email: String,    // Email (required, unique)
  createdAt: Date,  // Thời gian tạo (auto)
  updatedAt: Date   // Thời gian cập nhật (auto)
}
```

## Environment Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/groupDB
PORT=3001
NODE_ENV=development
```

## Troubleshooting

### Lỗi kết nối MongoDB
1. Kiểm tra `MONGODB_URI` trong file `.env`
2. Đảm bảo IP address được thêm vào Network Access
3. Kiểm tra username/password
4. Chạy `npm run test:mongodb` để test kết nối

### Lỗi duplicate email
- Email phải là unique trong database
- Kiểm tra xem email đã tồn tại chưa trước khi tạo mới

## Logs
Server sẽ hiển thị logs chi tiết:
- ✅ Kết nối MongoDB thành công
- 📋 Fetching users
- 📝 Creating new user
- ❌ Error messages với chi tiết

## Development
- Sử dụng `npm run dev` để development với auto-reload
- Sử dụng `npm run test:mongodb` để test kết nối database
- Logs chi tiết giúp debug dễ dàng

