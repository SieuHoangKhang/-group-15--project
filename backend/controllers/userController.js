// controllers/userController.js

let users = []; // Mảng lưu tạm dữ liệu người dùng
let nextId = 1;

// Lấy danh sách người dùng
exports.getUsers = (req, res) => {
  res.json(users);
};

// Tạo người dùng mới
exports.createUser = (req, res) => {
  const { name, email } = req.body;

  // Kiểm tra dữ liệu hợp lệ
  if (!name || !email) {
    return res.status(400).json({ message: 'Name và email là bắt buộc!' });
  }

  // Tạo user mới
  const newUser = { id: nextId++, name, email };
  users.push(newUser);

  res.status(201).json(newUser);
};
