# Hướng dẫn thiết lập MongoDB Atlas

## Bước 1: Tạo tài khoản MongoDB Atlas
1. Truy cập https://www.mongodb.com/cloud/atlas
2. Đăng ký tài khoản miễn phí
3. Xác thực email

## Bước 2: Tạo Cluster
1. Chọn "Build a Database"
2. Chọn "FREE" tier (M0)
3. Chọn Cloud Provider và Region (gần nhất với vị trí của bạn)
4. Đặt tên cluster (ví dụ: "group15-cluster")
5. Click "Create"

## Bước 3: Tạo Database và Collection
1. Sau khi cluster được tạo, click "Browse Collections"
2. Click "Create Database"
3. Database Name: `groupDB`
4. Collection Name: `users`
5. Click "Create"

## Bước 4: Tạo User Database
1. Vào "Database Access" trong menu bên trái
2. Click "Add New Database User"
3. Chọn "Password" authentication
4. Username: `group15-user` (hoặc tên bạn muốn)
5. Password: Tạo password mạnh
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

## Bước 5: Lấy Connection String
1. Vào "Database" trong menu bên trái
2. Click "Connect" trên cluster của bạn
3. Chọn "Connect your application"
4. Driver: "Node.js"
5. Version: "4.1 or later"
6. Copy connection string

## Bước 6: Cấu hình Environment Variables
1. Tạo file `.env` trong thư mục `backend/`
2. Copy nội dung từ `ENV_EXAMPLE.txt`
3. Thay thế các giá trị:
   - `<username>`: username bạn tạo ở bước 4
   - `<password>`: password bạn tạo ở bước 4
   - `<cluster-host>`: host từ connection string
   - `<app-name>`: tên ứng dụng (ví dụ: "group15-app")

## Bước 7: Cấu hình Network Access
1. Vào "Network Access" trong menu bên trái
2. Click "Add IP Address"
3. Chọn "Allow access from anywhere" (0.0.0.0/0) cho development
4. Click "Confirm"

## Ví dụ file .env hoàn chỉnh:
```
MONGODB_URI=mongodb+srv://group15-user:yourpassword@cluster0.abc123.mongodb.net/groupDB?retryWrites=true&w=majority&appName=group15-app
PORT=3001
NODE_ENV=development
```

## Kiểm tra kết nối
Sau khi cấu hình xong, chạy:
```bash
cd backend
npm start
```

Nếu thấy thông báo "Connected to MongoDB", bạn đã thành công!

