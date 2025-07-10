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
      imageUrl, audioUrl, duration,
      likedBy: [], // Khởi tạo mảng likedBy rỗng
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
          .limit(limit)
          .populate('likedBy', 'username'), // Populate để lấy thông tin user (tùy chọn)
      Song.countDocuments()
    ]);

    // Thêm số lượt thích và trạng thái liked cho user hiện tại
    const userId = req.user?.id; // Lấy từ middleware xác thực
    const songsWithLikes = songs.map(song => ({
      ...song._doc,
      likesCount: song.likedBy.length,
      isLiked: userId ? song.likedBy.includes(userId) : false,
    }));

    res.json({
      songs: songsWithLikes,
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
    const song = await Song.findById(req.params.id).populate('likedBy', 'username');
    if (!song) return res.status(404).json({ message: 'Không tìm thấy bài hát' });

    const userId = req.user?.id;
    res.json({
      ...song._doc,
      likesCount: song.likedBy.length,
      isLiked: userId ? song.likedBy.includes(userId) : false,
    });
  } catch (err) {
    console.error('❌ Lỗi khi lấy bài hát:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const likeSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Không tìm thấy bài hát' });

    const userId = req.user.id; // Lấy từ middleware xác thực
    if (song.likedBy.includes(userId)) {
      return res.status(400).json({ message: 'Bài hát đã được thích' });
    }

    song.likedBy.push(userId);
    await song.save();

    res.json({
      ...song._doc,
      likesCount: song.likedBy.length,
      isLiked: true,
    });
  } catch (err) {
    console.error('❌ Lỗi khi thích bài hát:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const unlikeSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Không tìm thấy bài hát' });

    const userId = req.user.id;
    if (!song.likedBy.includes(userId)) {
      return res.status(400).json({ message: 'Bài hát chưa được thích' });
    }

    song.likedBy = song.likedBy.filter(id => id.toString() !== userId);
    await song.save();

    res.json({
      ...song._doc,
      likesCount: song.likedBy.length,
      isLiked: false,
    });
  } catch (err) {
    console.error('❌ Lỗi khi bỏ thích bài hát:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getUserLikedSongs = async (req, res) => {
  try {
    const userId = req.user.id;
    const songs = await Song.find({ likedBy: userId })
      .sort({ createdAt: -1 })
      .populate('likedBy', 'username');

    const songsWithLikes = songs.map(song => ({
      ...song._doc,
      likesCount: song.likedBy.length,
      isLiked: true,
    }));

    res.json(songsWithLikes);
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách bài hát yêu thích:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const searchSongs = async (req, res) => {
  try {
    const { q } = req.query;
    const query = q
      ? {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { artist: { $regex: q, $options: 'i' } },
          ],
        }
      : {};
    const songs = await Song.find(query)
      .limit(10) // Giới hạn 10 gợi ý
      .select('_id title artist audioUrl imageUrl likedBy likesCount isLiked duration ');
    res.json(songs);
  } catch (err) {
    console.error('❌ Lỗi khi tìm kiếm bài hát:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getRandomSong = async (req, res) => {
  try {
    // Lấy ngẫu nhiên 1 bản ghi trong collection Song
    const [song] = await Song.aggregate([{ $sample: { size: 1 } }]);
    if (!song) {
      return res.status(404).json({ message: 'Không tìm thấy bài hát nào' });
    }
    const userId = req.user?.id;
    // Trả về thêm số lượt like và trạng thái của user
    res.json({
      ...song,
      likesCount: song.likedBy.length,
      isLiked: userId ? song.likedBy.includes(userId) : false
    });
  } catch (err) {
    console.error('❌ Lỗi khi lấy bài hát ngẫu nhiên:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};