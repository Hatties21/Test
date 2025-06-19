// server/routes/auth.js
import express from 'express';
import { genSalt, hash as _hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email đã tồn tại
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    // Mã hoá mật khẩu
    const salt = await genSalt(10);
    const hashed = await _hash(password, salt);

    // Tạo user mới
    const newUser = await User.create({ email, password: hashed });
    return res.status(201).json({ message: 'Đăng ký thành công', userId: newUser._id });
  } catch (err) {
    console.error('❌ Register error:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    // So sánh mật khẩu
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng!' });
    }

    // Tạo JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    // Trả về thông tin user (không gởi password) và token
    const { password: pwd, ...info } = user._doc;
    return res.status(200).json({ ...info, token });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;
