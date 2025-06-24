// server/index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import authRoutes from './routes/auth.js';  // nhớ thêm .js ở cuối
import songRoutes from './routes/song.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/songs', songRoutes);
app.use('/uploads', express.static('uploads'));

// Kết nối MongoDB
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Đăng ký route
app.use('/api/auth', authRoutes);

// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
