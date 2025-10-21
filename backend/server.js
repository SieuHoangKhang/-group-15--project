import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

if (!mongoUri) {
  console.error('Missing MONGODB_URI in environment');
  process.exit(1);
}

async function connectDatabase() {
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  });
  console.log('Connected to MongoDB');
}

app.get('/users', async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'name and email are required' });
    }
    const created = await User.create({ name, email });
    res.status(201).json(created);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Failed to create user' });
  }
});

connectDatabase()
  .then(() => {
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });

// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.json());
// Cho phép CORS từ localhost/127.0.0.1 trên mọi cổng (phục vụ dev)
app.use(cors({
  origin: (origin, callback) => {
    // Cho phép request không có origin (curl, Postman)
    if (!origin) return callback(null, true);
    const allow = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
    if (allow) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Import routes
const userRouter = require('./routes/user');
// Theo yêu cầu bài: endpoint là /users (không có prefix /api)
app.use('/', userRouter);

// Phục vụ static frontend build (một cổng duy nhất)
// Thư mục frontend nằm tại: TH_Buoi4/frontend
const frontendBuildPath = path.join(__dirname, '..', '..', 'frontend', 'build');
app.use(express.static(frontendBuildPath));
// Catch-all: trả về index.html cho mọi route KHÔNG bắt đầu bằng /api (Express 5 dùng regex)
// Catch-all cho SPA (loại trừ /users nếu muốn, nhưng do route đã đặt trước nên không bắt vào /users)
app.get(/^\/(?!api).*/, (req, res) => {
  return res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Route gốc sẽ được file index.html xử lý SPA, không cần trả text riêng

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy ở cổng ${PORT}`);
});
