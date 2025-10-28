const User = require('../models/User'); // THAY THẾ: Import User Model (đã tạo ở bước trước)

// @route   GET /users
// @desc    Lấy danh sách người dùng; hỗ trợ tìm kiếm q (name/email chứa chuỗi, không phân biệt hoa thường)
// @access  Public
exports.getUsers = async (req, res) => { // Sửa thành hàm async
    try {
    const { q, email, auth } = req.query || {};
    let filter = {};

        if (typeof email === 'string' && email.trim()) {
            filter.email = email.trim().toLowerCase();
        } else if (typeof q === 'string' && q.trim()) {
            const regex = new RegExp(q.trim(), 'i');
            filter = { $or: [{ name: regex }, { email: regex }] };
        }

        // Nếu muốn chỉ lấy các tài khoản có mật khẩu (đăng ký qua /auth/signup), dùng auth=local
        if (auth === 'local') {
            filter.password = { $exists: true, $ne: null };
        }

        const users = await User.find(filter); // DÙNG MONGODB: Lấy theo filter (hoặc tất cả)
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
    const { name, email, phone, address } = req.body;
    
    // Kiểm tra dữ liệu hợp lệ (Mongoose cũng kiểm tra required)
    if (!name || !email) {
        return res.status(400).json({ message: 'Name và email là bắt buộc!' });
    }

    try {
        // 1. Tạo một đối tượng User mới
        const newUser = new User({
            name,
            email,
            phone: phone || null,
            address: address || null,
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

// @route   PUT /users/:id
// @desc    Cập nhật người dùng theo id
// @access  Public
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name && !email) {
        return res.status(400).json({ message: 'Cần cung cấp ít nhất một trường để cập nhật (name hoặc email).' });
    }

    try {
        const update = {};
        if (typeof name === 'string') update.name = name;
        if (typeof email === 'string') update.email = email;

        // Allow role change only if requester is admin
        if (typeof req.body.role === 'string') {
            const requester = req.user || {};
            if (requester.role !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền thay đổi role' });
            }
            if (['user','admin'].includes(req.body.role)) update.role = req.body.role;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            update,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Không tìm thấy user' });
        }
        return res.json(updatedUser);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email này đã tồn tại trong hệ thống.' });
        }
        return res.status(400).json({ message: err.message });
    }
};

// @route   DELETE /users/:id
// @desc    Xoá người dùng theo id
// @access  Public
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Authorization: allow if requester is admin or deleting their own account
        const requester = req.user || {};
        const isAdmin = requester.role === 'admin';
        const isSelf = requester.sub === id;
        if (!isAdmin && !isSelf) {
            return res.status(403).json({ message: 'Bạn không có quyền xoá tài khoản này' });
        }

        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Không tìm thấy user' });
        }
        return res.json({ message: 'Đã xoá user', id });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

// @route   GET /profile
// @desc    Lấy thông tin user hiện tại từ token
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const { sub } = req.user || {};
        if (!sub) return res.status(401).json({ message: 'Thiếu thông tin người dùng trong token' });
        const user = await User.findById(sub);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    const { id, name, email, phone, address } = user.toJSON();
    return res.json({ id, name, email, phone, address });
    } catch (err) {
        console.error('GetProfile error:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};

// @route   PUT /profile
// @desc    Cập nhật thông tin user hiện tại (name, email)
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { sub } = req.user || {};
        console.log('UpdateProfile called for sub=', sub, 'body=', req.body);
        if (!sub) return res.status(401).json({ message: 'Thiếu thông tin người dùng trong token' });
    const { name, email, phone, address } = req.body || {};
    if (!name && !email && !phone && !address) return res.status(400).json({ message: 'Cần cung cấp ít nhất một trường để cập nhật' });

    const update = {};
    if (typeof name === 'string') update.name = name;
    if (typeof email === 'string') update.email = email;
    if (typeof phone === 'string') update.phone = phone;
    if (typeof address === 'string') update.address = address;

        const updated = await User.findByIdAndUpdate(sub, update, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    const { id, name: n, email: e, phone: p, address: a } = updated.toJSON();
    return res.json({ id, name: n, email: e, phone: p, address: a });
    } catch (err) {
        console.error('UpdateProfile error:', err);
        if (err.code === 11000) return res.status(400).json({ message: 'Email này đã tồn tại.' });
        return res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};
