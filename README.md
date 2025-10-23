### 💼 Phân công công việc nhóm

- 🧩 **Đặng Thiên Chương (223463)** – Backend (Node.js + Express)  
- 🎨 **Trần Siêu Hoàng Khang (221429)** – Frontend (React)  
- 🗄️ **Nguyễn Minh Tiến (221622)** – Database (MongoDB)

## 🚀 Chạy ứng dụng (Frontend + Backend + MongoDB)

Yêu cầu:
- Node.js LTS, npm
- MongoDB (Atlas hoặc local)

### 1) Thiết lập MongoDB
- Tạo file `backend/.env` từ mẫu `backend/.env.example` và điền `MONGO_URI`.
	- Atlas (khuyên dùng):
		`MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`
	- Local:
		`MONGO_URI=mongodb://127.0.0.1:27017/<database>`

### 2) Cài đặt dependencies
- Backend:
	- Thư mục: `backend`
	- Lệnh: `npm install`
- Frontend:
	- Thư mục: `frontend`
	- Lệnh: `npm install`

### 3) Build frontend và khởi động backend
- Build frontend:
	- Thư mục: `frontend`
	- Lệnh: `npm run build`
- Khởi động backend (phục vụ cả API và build của frontend):
	- Thư mục: `backend`
	- Lệnh: `npm start`
- Mở trình duyệt: http://localhost:3000

API sẵn có:
- `GET /users` – Lấy danh sách users
- `POST /users` – Tạo user `{ name, email }`
- `DELETE /users/:id` – Xoá user theo id

Lưu ý:
- Email là unique, nhập email trùng sẽ báo lỗi.
- Nếu muốn chạy dev tách cổng, cấu hình proxy CRA về cổng backend và chạy `npm start` ở cả `frontend` và `backend`.
