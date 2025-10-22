# 🔗 Hướng dẫn tạo Pull Request và lấy link

## Bước 1: Truy cập GitHub Repository

1. **Mở browser và truy cập:**
   ```
   https://github.com/SieuHoangKhang/-group-15--project
   ```

2. **Kiểm tra branch:**
   - Đảm bảo bạn đang ở branch `database`
   - Branch đã được push lên GitHub

## Bước 2: Tạo Pull Request

1. **Tìm thông báo:**
   - Trên trang GitHub, bạn sẽ thấy thông báo:
   ```
   "database had recent pushes"
   [Compare & pull request] <- Click vào đây
   ```

2. **Hoặc tạo thủ công:**
   - Click tab "Pull requests"
   - Click "New pull request"
   - Chọn: `database` → `main`

## Bước 3: Điền thông tin PR

### Title:
```
feat: Complete MongoDB Atlas Integration - Activity 5
```

### Description:
```markdown
## 📋 Hoạt động 5: Tích hợp MongoDB Atlas

### ✅ Đã hoàn thành:
- [x] Tạo tài khoản MongoDB Atlas, cluster
- [x] Tạo database groupDB, collection users
- [x] Cài đặt mongoose package
- [x] Tạo model User.js (name, email)
- [x] Cập nhật server.js để GET/POST/DELETE dữ liệu từ MongoDB
- [x] Commit + push branch database
- [x] Tích hợp frontend với backend API
- [x] Test toàn bộ hệ thống

### 🔧 Các tính năng:
- **MongoDB Atlas Connection**: Kết nối thành công với cloud database
- **API Endpoints**: GET/POST/DELETE /users
- **Frontend Integration**: Frontend gọi API backend
- **Error Handling**: Xử lý lỗi chi tiết
- **Validation**: Kiểm tra dữ liệu và duplicate email
- **Testing**: Script test kết nối MongoDB

### 📁 Files thay đổi:
- `backend/server.js` - API server với MongoDB
- `backend/models/User.js` - User model
- `backend/package.json` - Dependencies
- `frontend/src/UserList.jsx` - Tích hợp API
- `frontend/src/AddUser.jsx` - Tích hợp API
- Documentation và setup guides

### 🧪 Test Results:
✅ MongoDB Atlas connection successful
✅ All API endpoints working
✅ Frontend integration complete
✅ Full CRUD operations tested

**Vai trò:** Sinh viên 3 - Backend Developer
```

## Bước 4: Tạo PR

1. **Click "Create pull request"**
2. **Chờ PR được tạo**
3. **Copy link PR**

## Bước 5: Lấy link PR

Sau khi tạo PR thành công, URL sẽ có dạng:
```
https://github.com/SieuHoangKhang/-group-15--project/pull/[SỐ_PR]
```

**Ví dụ:**
```
https://github.com/SieuHoangKhang/-group-15--project/pull/1
```

## Bước 6: Lưu link

Copy và lưu link PR để nộp bài.

## Lưu ý:
- Đảm bảo branch `database` đã được push lên GitHub
- PR sẽ hiển thị tất cả commits và thay đổi
- Có thể thêm reviewers nếu cần
- PR sẵn sàng để merge sau khi được approve

