# 📋 HƯỚNG DẪN NỘP BÀI - HOẠT ĐỘNG 5

## 🎯 **Sản phẩm cần nộp:**

### 1️⃣ **File User.js**
- **File:** `SUBMISSION_USER_MODEL.js` (đã tạo)
- **Nội dung:** Model User với validation đầy đủ
- **Giải thích:** Có comment chi tiết về từng field

### 2️⃣ **Ảnh dữ liệu trong MongoDB Atlas**
- **Cần chụp 3 ảnh:**
  1. `mongodb_database_overview.png` - Tổng quan database
  2. `mongodb_users_data.png` - Dữ liệu users chi tiết  
  3. `mongodb_schema.png` - Schema validation

**Hướng dẫn chụp ảnh:** Xem file `MONGODB_SCREENSHOT_GUIDE.md`

### 3️⃣ **Link Pull Request**
- **Tạo PR:** Làm theo `CREATE_PR_STEPS.md`
- **Link có dạng:** `https://github.com/SieuHoangKhang/-group-15--project/pull/[SỐ]`

---

## 📝 **Các bước thực hiện:**

### Bước 1: Chuẩn bị dữ liệu MongoDB
```bash
# Chạy server
cd backend
npm start

# Tạo dữ liệu test (PowerShell)
$body1 = @{name="Nguyễn Văn A"; email="nguyenvana@example.com"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/users" -Method POST -Body $body1 -ContentType "application/json"

$body2 = @{name="Trần Thị B"; email="tranthib@example.com"} | ConvertTo-Json  
Invoke-RestMethod -Uri "http://localhost:3001/users" -Method POST -Body $body2 -ContentType "application/json"

$body3 = @{name="Lê Văn C"; email="levanc@example.com"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/users" -Method POST -Body $body3 -ContentType "application/json"
```

### Bước 2: Chụp ảnh MongoDB Atlas
1. Truy cập: https://cloud.mongodb.com/
2. Vào cluster → Browse Collections
3. Chọn database `groupDB` → collection `users`
4. Chụp 3 ảnh theo hướng dẫn

### Bước 3: Tạo Pull Request
1. Truy cập: https://github.com/SieuHoangKhang/-group-15--project
2. Click "Compare & pull request"
3. Điền thông tin theo template
4. Click "Create pull request"
5. Copy link PR

---

## 📦 **Cấu trúc nộp bài:**

```
HOẠT_ĐỘNG_5_NỘP_BÀI/
├── SUBMISSION_USER_MODEL.js          # File User.js
├── mongodb_database_overview.png     # Ảnh 1: Tổng quan DB
├── mongodb_users_data.png           # Ảnh 2: Dữ liệu users
├── mongodb_schema.png               # Ảnh 3: Schema
└── PR_LINK.txt                      # Link Pull Request
```

---

## ✅ **Checklist nộp bài:**

- [ ] File User.js đã chuẩn bị (`SUBMISSION_USER_MODEL.js`)
- [ ] Đã tạo dữ liệu test trong MongoDB Atlas
- [ ] Đã chụp 3 ảnh MongoDB Atlas
- [ ] Đã tạo Pull Request trên GitHub
- [ ] Đã copy link PR
- [ ] Đã đóng gói tất cả file để nộp

---

## 🎯 **Kết quả mong đợi:**

### File User.js:
```javascript
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
```

### Ảnh MongoDB Atlas:
- Hiển thị database `groupDB`
- Collection `users` với dữ liệu
- Schema validation rules

### Link PR:
- PR đã được tạo thành công
- Có title và description đầy đủ
- Hiển thị tất cả thay đổi code

---

## 🚀 **Lưu ý quan trọng:**

1. **Đảm bảo server đang chạy** trước khi tạo dữ liệu
2. **Kiểm tra kết nối MongoDB Atlas** trước khi chụp ảnh
3. **Test API endpoints** trước khi tạo PR
4. **Lưu tất cả file** trước khi nộp bài

**🎉 Chúc bạn nộp bài thành công!**

