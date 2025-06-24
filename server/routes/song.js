import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { parseFile } from 'music-metadata';
import Song from '../models/Song.js';

const router = express.Router();

// Create uploads folder if not exists
const UPLOADS_DIR = path.join('uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

const IMAGE_DIR = path.join('uploads', 'images');
const AUDIO_DIR = path.join('uploads', 'audios');

if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });


// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, IMAGE_DIR);
    } else if (file.fieldname === 'audio') {
      cb(null, AUDIO_DIR);
    } else {
      cb(new Error('Invalid file field'), null);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// POST /api/songs
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, artist, type, username, description } = req.body;
    const image = req.files.image?.[0];
    const audio = req.files.audio?.[0];

    if (!title || !artist || !type || !username || !image || !audio) {
      return res.status(400).json({ message: 'Thiếu thông tin yêu cầu' });
    }

    // Get duration from audio
    const metadata = await parseFile(audio.path);
    const duration = Math.round(metadata.format.duration || 0);

    const newSong = await Song.create({
      title,
      artist,
      username,
      type,
      description: description || "",
      createdAt: new Date(),
      imageUrl: `/uploads/images/${image.filename}`,
      audioUrl: `/uploads/audios/${audio.filename}`,
      duration,
    });

    return res.status(201).json(newSong);
  } catch (err) {
    console.error('❌ Lỗi khi thêm bài hát:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

// GET /api/songs
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const [songs, totalCount] = await Promise.all([
      Song.find()
        .sort({ createdAt: -1 }) // 🔥 Sắp xếp bài mới nhất trước
        .skip(skip)
        .limit(limit),
      Song.countDocuments()
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      songs,
      totalPages,
      currentPage: page
    });
  } catch (err) {
    console.error("Lỗi khi lấy bài hát:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});


// GET /api/songs/:id
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Không tìm thấy bài hát' });
    res.json(song);
  } catch (err) {
    console.error('Lỗi khi lấy bài hát:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

export default router;