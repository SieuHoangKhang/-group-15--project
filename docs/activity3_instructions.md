Hướng dẫn kiểm thử Activity 3 — Quản lý User (Admin)

Mục tiêu: chứng minh các chức năng:
- Danh sách người dùng (GET /api/users) — chỉ admin được truy cập
- Xóa tài khoản (DELETE /api/users/:id) — admin hoặc chính chủ

Yêu cầu trước khi bắt đầu:
- Backend đang chạy (ví dụ `npm start` trong thư mục `backend`) và lắng nghe ở cổng 3000 (mặc định)
- MongoDB có dữ liệu users; nếu cần tạo user hãy dùng POST /api/auth/signup

Các bước nhanh (PowerShell):

1) Tạo 2 tài khoản (nếu cần):

$signup = @'
{
  "name": "Admin Account",
  "email": "admin@example.com",
  "password": "adminpass"
}
'@
Invoke-RestMethod -Uri http://localhost:3000/api/auth/signup -Method Post -Body $signup -ContentType 'application/json'

$signup2 = @'
{
  "name": "Regular User",
  "email": "user@example.com",
  "password": "userpass"
}
'@
Invoke-RestMethod -Uri http://localhost:3000/api/auth/signup -Method Post -Body $signup2 -ContentType 'application/json'

2) Promote user thành admin (nếu cần):

# Cách 1: dùng script đã thêm (yêu cầu MONGO_URI trỏ tới DB)
$env:MONGO_URI = 'mongodb://localhost:27017/yourdb'
node .\backend\scripts\promote-admin.js admin@example.com

# Cách 2: dùng mongo shell hoặc Compass
# mongo --eval "db = db.getSiblingDB('yourdb'); db.users.updateOne({ email: 'admin@example.com' }, { $set: { role: 'admin' } })"

3) Lấy token bằng lệnh login (PowerShell):
$login = @'{"email":"admin@example.com","password":"adminpass"}'@
$res = Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method Post -Body $login -ContentType 'application/json'
$token = $res.token

4) Test GET /api/users:
Invoke-RestMethod -Uri http://localhost:3000/api/users -Method Get -Headers @{ Authorization = "Bearer $token" }

5) Test DELETE /api/users/:id (ví dụ xóa user@example.com):
# Lấy id user muốn xóa
$users = Invoke-RestMethod -Uri http://localhost:3000/api/users -Method Get -Headers @{ Authorization = "Bearer $token" }
# chọn id cần xóa
$userId = ($users | Where-Object { $_.email -eq 'user@example.com' }).id
Invoke-RestMethod -Uri "http://localhost:3000/api/users/$userId" -Method Delete -Headers @{ Authorization = "Bearer $token" }

Ghi chú khắc phục lỗi 403:
- Nếu GET /api/users trả 403, nghĩa là token hợp lệ nhưng user.role không phải 'admin'. Hãy kiểm tra DB và promote lên admin rồi đăng nhập lại.
- Nếu Authorization header không được gửi, kiểm tra `frontend/src/api.js` và xác nhận localStorage có 'token'.

Postman:
- Import file `docs/postman/activity3.postman_collection.json` vào Postman.
- Chạy request "Login (get token)" -> xem Tests tab đã lưu token vào environment biến `token`.
- Chạy "Get users" và "Delete user (by id)".

Nếu bạn muốn, tôi có thể tự tạo các screenshot mẫu (nhưng cần backend đang chạy tại localhost:3000 và bạn cho phép chạy 1 số lệnh) hoặc hướng dẫn chi tiết hơn tùy môi trường của bạn.
