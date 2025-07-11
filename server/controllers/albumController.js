import Album from '../models/Album.js';

/**
 * Lấy toàn bộ album có chi tiết (populate uploader và songs)
 */
export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find()
      .populate('uploader', 'username')
      .populate('songs');
    res.json(albums);
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách album:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

/**
 * Lấy chi tiết 1 album theo ID
 */
export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('uploader', 'username')
      .populate('songs');
    if (!album) {
      return res.status(404).json({ error: 'Album không tồn tại' });
    }
    res.json(album);
  } catch (err) {
    console.error('❌ Lỗi khi lấy chi tiết album:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

/**
 * Tạo mới album
 */
export const createAlbum = async (req, res) => {
  try {
    const { title, artist, uploader, genre, coverUrl, releaseDate, songs } = req.body;
    const newAlbum = new Album({
      title,
      artist,
      uploader,
      genre,
      coverUrl,
      releaseDate,
      songs
    });
    const saved = await newAlbum.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Lỗi khi tạo album:', err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Cập nhật album
 */
export const updateAlbum = async (req, res) => {
  try {
    const updated = await Album.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Album không tồn tại' });
    }
    res.json(updated);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật album:', err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Xóa album
 */
export const deleteAlbum = async (req, res) => {
  try {
    const removed = await Album.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Album không tồn tại' });
    }
    res.json({ message: 'Xóa album thành công' });
  } catch (err) {
    console.error('❌ Lỗi khi xóa album:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
