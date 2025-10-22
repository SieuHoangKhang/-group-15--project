// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://minhtien995252_db_user:minhtien995252@cluster0.cso3ogg.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0';

// CORS: dev -> allow all; production -> whitelist specific origins
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://your-production-domain.com'] // <- thay bằng domain thật
    : true
};

app.use(cors(corsOptions));
app.use(express.json());

// Kiểm biến môi trường
if (!mongoUri) {
  console.error('Missing MONGO_URI (or MONGODB_URI) in environment');
  process.exit(1);
}

// Mongoose event handlers
mongoose.connection.on('connected', () => {
  console.log('🔌 Mongoose connected to', mongoose.connection.host);
});
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('🔒 Mongoose disconnected');
});

async function connectDatabase() {
  try {
    await mongoose.connect(mongoUri, {
      // Mongoose 7+ tự bật một số option; đặt timeout / pool size là hợp lý
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });
    console.log('✅ Connected to MongoDB Atlas successfully');
    // Guard: sometimes connection.db may be undefined briefly
    const dbName = mongoose.connection.db?.databaseName ?? '(unknown)';
    console.log(`📊 Database: ${dbName}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message || error);
    throw error;
  }
}

// Routes
app.get('/users', async (req, res) => {
  try {
    console.log('📋 Fetching all users from MongoDB...');
    const users = await User.find().lean();
    console.log(`✅ Found ${users.length} users`);
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err.message || err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(`📝 Creating new user: ${name} (${email})`);

    // Basic validation (có thể mở rộng)
    if (!name || !email) {
      console.log('❌ Validation failed: name and email are required');
      return res.status(400).json({ message: 'name and email are required' });
    }

    // Optional: simple email regex (tùy bạn có muốn)
    // if (!/^\S+@\S+\.\S+$/.test(email)) {
    //   return res.status(400).json({ message: 'Invalid email format' });
    // }

    const created = await User.create({ name, email });
    console.log(`✅ User created successfully with ID: ${created._id}`);
    res.status(201).json(created);
  } catch (err) {
    // Duplicate key (unique email) từ MongoDB
    if (err.code === 11000) {
      console.log('❌ Duplicate email error:', req.body?.email);
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error('❌ Error creating user:', err.message || err);
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
});

// Start server after DB connected
let server;
connectDatabase()
  .then(() => {
    server = app.listen(port, () => {
      console.log('🚀 Server started successfully!');
      console.log(`🌐 Server listening on port ${port}`);
      console.log('📡 API endpoints:');
      console.log(`   GET  http://localhost:${port}/users`);
      console.log(`   POST http://localhost:${port}/users`);
      console.log('='.repeat(50));
    });
  })
  .catch((err) => {
    console.error('💥 Server startup failed:', err.message || err);
    process.exit(1);
  });

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('🛑 Graceful shutdown initiated');
  if (server) {
    server.close(() => {
      console.log('🔒 HTTP server closed');
    });
  }
  try {
    await mongoose.disconnect();
    console.log('✅ Mongoose disconnected (graceful)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// (Optional) export for tests
export default app;
