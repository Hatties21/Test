import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import songRoutes from './routes/song.js';
import albumRoutes from './routes/album.js';

const app = express();

// Middleware chung
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Các route
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy route' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Lỗi server:', err);
  res.status(500).json({ message: 'Lỗi server' });
});

// Kết nối MongoDB & khởi chạy server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
