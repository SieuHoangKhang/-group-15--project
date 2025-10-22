# 📸 Hướng dẫn chụp ảnh dữ liệu MongoDB Atlas

## Bước 1: Tạo dữ liệu test

### Chạy server và tạo dữ liệu:
```bash
cd backend
npm start
```

### Tạo users bằng PowerShell:
```powershell
# User 1
$body1 = @{name="Nguyễn Văn A"; email="nguyenvana@example.com"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/users" -Method POST -Body $body1 -ContentType "application/json"

# User 2  
$body2 = @{name="Trần Thị B"; email="tranthib@example.com"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/users" -Method POST -Body $body2 -ContentType "application/json"

# User 3
$body3 = @{name="Lê Văn C"; email="levanc@example.com"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/users" -Method POST -Body $body3 -ContentType "application/json"
```

## Bước 2: Truy cập MongoDB Atlas

1. **Đăng nhập MongoDB Atlas:**
   - Truy cập: https://cloud.mongodb.com/
   - Đăng nhập với tài khoản đã tạo

2. **Vào Database:**
   - Click vào cluster của bạn
   - Click "Browse Collections"

3. **Xem dữ liệu:**
   - Chọn database: `groupDB`
   - Chọn collection: `users`
   - Bạn sẽ thấy danh sách users đã tạo

## Bước 3: Chụp ảnh

### Ảnh 1: Tổng quan database
- Chụp màn hình hiển thị:
  - Database: `groupDB`
  - Collection: `users`
  - Số lượng documents

### Ảnh 2: Chi tiết dữ liệu
- Chụp màn hình hiển thị:
  - Danh sách users với đầy đủ thông tin
  - Các field: `_id`, `name`, `email`, `createdAt`, `updatedAt`

### Ảnh 3: Schema validation
- Chụp màn hình hiển thị:
  - Schema của collection users
  - Các validation rules

## Bước 4: Lưu ảnh

Lưu các ảnh với tên:
- `mongodb_database_overview.png`
- `mongodb_users_data.png` 
- `mongodb_schema.png`

## Ví dụ dữ liệu mong đợi:

```json
[
  {
    "_id": "68f88163c530d07bb09618d8",
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "createdAt": "2025-10-22T07:01:55.842Z",
    "updatedAt": "2025-10-22T07:01:55.842Z",
    "__v": 0
  },
  {
    "_id": "68f88163c530d07bb09618d9", 
    "name": "Trần Thị B",
    "email": "tranthib@example.com",
    "createdAt": "2025-10-22T07:02:15.123Z",
    "updatedAt": "2025-10-22T07:02:15.123Z",
    "__v": 0
  },
  {
    "_id": "68f88163c530d07bb09618da",
    "name": "Lê Văn C", 
    "email": "levanc@example.com",
    "createdAt": "2025-10-22T07:02:35.456Z",
    "updatedAt": "2025-10-22T07:02:35.456Z",
    "__v": 0
  }
]
```

