import express from 'express';
import Like from '../models/Like.js'; // model Like
import Song from '../models/Song.js';

const router = express.Router();

// Thêm bài hát vào danh sách yêu thích
router.post('/', async (req, res) => {
  const { userId, songId } = req.body;
  try {
    const exists = await Like.findOne({ userId, songId });
    if (exists) return res.status(400).json({ message: 'Đã thích rồi' });

    const like = await Like.create({ userId, songId });
    res.status(201).json(like);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Hủy thích
router.delete('/', async (req, res) => {
  const { userId, songId } = req.body;
  try {
    await Like.findOneAndDelete({ userId, songId });
    res.json({ message: 'Đã bỏ thích' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Kiểm tra đã thích chưa
router.get('/check', async (req, res) => {
  const { userId, songId } = req.query;
  try {
    const liked = await Like.exists({ userId, songId });
    res.json({ liked: !!liked });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Lấy danh sách bài hát đã thích của user
router.get('/user/:userId', async (req, res) => {
  try {
    const likes = await Like.find({ userId: req.params.userId }).populate('songId');
    const songs = likes.map(l => l.songId);
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;
