import Album from "../models/Album.js";

/**
 * Lấy toàn bộ album có chi tiết (populate uploader và songs)
 */
export const getAllAlbums = async (req, res) => {
  try {
    // nếu có req.query.uploader thì chỉ lấy album của user đó
    const filter = {};
    if (req.query.uploader) filter.uploader = req.query.uploader;
    const albums = await Album.find(filter)
      .populate("uploader", "username")
      .populate("songs");
    res.json(albums);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách album:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

/**
 * Lấy chi tiết 1 album theo ID
 */
export const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate("uploader", "username")
      .populate("songs");
    if (!album) {
      return res.status(404).json({ error: "Album không tồn tại" });
    }
    res.json(album);
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết album:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

/**
 * Tạo mới album
 */
export const createAlbum = async (req, res) => {
  try {
    const { title, artist, genre, coverUrl, releaseDate, songs } = req.body;
    // Lấy uploader từ req.user.id (đã auth)
    const uploader = req.user.id;
    const newAlbum = new Album({
      title,
      artist,
      uploader,
      genre,
      coverUrl,
      releaseDate,
      songs: songs || [],
    });
    const saved = await newAlbum.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Lỗi khi tạo album:", err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Cập nhật album
 */
export const updateAlbum = async (req, res) => {
  try {
    const updated = await Album.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Album không tồn tại" });
    }
    res.json(updated);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật album:", err);
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
      return res.status(404).json({ error: "Album không tồn tại" });
    }
    res.json({ message: "Xóa album thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa album:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

export const getMyAlbums = async (req, res) => {
  try {
    const albums = await Album.find({ uploader: req.user.id })
      .populate("uploader", "username")
      .populate("songs");
    res.json(albums);
  } catch (err) {
    console.error("❌ Lỗi khi lấy album của user:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
};

/**
 * Thêm 1 bài hát vào album
 * POST /api/albums/:id/songs
 * body: { songId }
 */
export const addSongToAlbum = async (req, res) => {
  try {
    const { songId } = req.body;
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { songs: songId } },
      { new: true }
    ).populate("songs");
    if (!album) return res.status(404).json({ error: "Album không tồn tại" });
    res.json(album);
  } catch (err) {
    console.error("❌ Lỗi khi thêm bài hát vào album:", err);
    res.status(400).json({ error: err.message });
  }
};

/**
 * Xóa 1 bài hát khỏi album
 * DELETE /api/albums/:id/songs/:songId
 */
export const removeSongFromAlbum = async (req, res) => {
  try {
    const { songId } = req.params;
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { $pull: { songs: songId } },
      { new: true }
    ).populate("songs");
    if (!album) return res.status(404).json({ error: "Album không tồn tại" });
    res.json(album);
  } catch (err) {
    console.error("❌ Lỗi khi xóa bài hát khỏi album:", err);
    res.status(400).json({ error: err.message });
  }
};