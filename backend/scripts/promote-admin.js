// promote-admin.js
// Sử dụng: node promote-admin.js admin@example.com
// Environment: set MONGO_URI (ví dụ: mongodb://localhost:27017/yourdb)

const mongoose = require('mongoose');
const User = require('../models/User');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node promote-admin.js <email>');
  process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test';

async function run() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.error('Không tìm thấy user với email:', email);
      process.exit(2);
    }
    user.role = 'admin';
    await user.save();
    console.log('Đã cập nhật role thành admin cho', email);
    process.exit(0);
  } catch (err) {
    console.error('Lỗi:', err);
    process.exit(3);
  } finally {
    await mongoose.disconnect();
  }
}

run();
