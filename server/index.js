// server/index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import songRoutes from './routes/song.js';

const app = express();

// Middleware chung
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Route: auth trước
app.use('/api/auth', authRoutes);

// Route: songs
app.use('/api/songs', songRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
