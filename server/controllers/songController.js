import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';
import Song from '../models/Song.js';

const ensureDir = dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

export const createSong = async (req, res) => {
  try {
    const { title, artist, type, username, description } = req.body;
    const image = req.files.image?.[0];
    const audio = req.files.audio?.[0];
    if (!title || !artist || !type || !username || !image || !audio) {
      return res.status(400).json({ message: 'Thiếu thông tin yêu cầu' });
    }

    const IMAGE_DIR = path.join('uploads','images');
    const AUDIO_DIR = path.join('uploads','audios');
    ensureDir(IMAGE_DIR);
    ensureDir(AUDIO_DIR);

    const imageUrl = `/uploads/images/${image.filename}`;
    const audioUrl = `/uploads/audios/${audio.filename}`;

    const metadata = await parseFile(audio.path);
    const duration = Math.round(metadata.format.duration || 0);

    const newSong = await Song.create({
      title, artist, username, type,
      description: description || "",
      imageUrl, audioUrl, duration
    });

    res.status(201).json(newSong);
  } catch (err) {
    console.error('❌ Lỗi khi thêm bài hát:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getSongs = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip  = (page - 1) * limit;

    const [songs, total] = await Promise.all([
      Song.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
      Song.countDocuments()
    ]);

    res.json({
      songs,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('❌ Lỗi khi lấy bài hát:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Không tìm thấy bài hát' });
    res.json(song);
  } catch (err) {
    console.error('❌ Lỗi khi lấy bài hát:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
