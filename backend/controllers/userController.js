const User = require('../models/User'); // THAY THẾ: Import User Model (đã tạo ở bước trước)

// @route   GET /users
// @desc    Lấy tất cả người dùng từ MongoDB
// @access  Public
exports.getUsers = async (req, res) => { // Sửa thành hàm async
    try {
        const users = await User.find(); // DÙNG MONGODB: Lệnh Mongoose để lấy tất cả
        res.json(users);
    } catch (err) {
        // Ghi lại lỗi và trả về lỗi server 500 nếu có vấn đề khi truy vấn
        console.error(err.message);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách người dùng.' });
    }
};

// @route   POST /users
// @desc    Tạo người dùng mới và lưu vào MongoDB
// @access  Public
exports.createUser = async (req, res) => { // Sửa thành hàm async
    const { name, email } = req.body;
    
    // Kiểm tra dữ liệu hợp lệ (Mongoose cũng kiểm tra required)
    if (!name || !email) {
        return res.status(400).json({ message: 'Name và email là bắt buộc!' });
    }

    try {
        // 1. Tạo một đối tượng User mới
        const newUser = new User({
            name,
            email
        });

        // 2. Lưu vào database (sử dụng .save())
        const savedUser = await newUser.save();
        
        // 3. Trả về đối tượng vừa được lưu với mã trạng thái 201 (Created)
        res.status(201).json(savedUser); 
    } catch (err) {
        // Xử lý lỗi trùng email (E11000 duplicate key error)
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email này đã tồn tại trong hệ thống.' });
        }
        // Xử lý lỗi validation khác
        res.status(400).json({ message: err.message });
    }
};
