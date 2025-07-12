// server/controllers/userController.js

import User from '../models/User.js';
import Song from '../models/Song.js';  // chỉ cần khi bạn muốn đồng bộ hoặc xóa tài nguyên liên quan

/**
 * PUT /api/auth/me
 * Cập nhật thông tin user hiện tại (name, email)
 * req.user.id do auth middleware gán
 */
export const updateCurrentUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Thiếu tên hoặc email' });
    }

    // Kiểm tra email mới có bị trùng không
    const exists = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (exists) {
      return res.status(409).json({ message: 'Email đã được sử dụng' });
    }

    // Lưu lại name cũ để đồng bộ sang songs nếu cần
    const oldUser = await User.findById(req.user.id);
    const oldName = oldUser.name;

    // Cập nhật user
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    // --- Tuỳ chọn: đồng bộ lại tất cả songs của user sang name mới ---
     await Song.updateMany(
       { username: oldName },
       { $set: { username: updated.name } }
     );

    return res.json(updated);
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật user:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

/**
 * DELETE /api/auth/me
 * Xóa tài khoản user hiện tại
 */
export const deleteCurrentUser = async (req, res) => {
  try {
    // 1. Xóa user
    await User.findByIdAndDelete(req.user.id);

    // 2. (Tuỳ chọn) Xóa luôn các bài hát do user này upload
     await Song.deleteMany({ username: req.user.name });

    return res.json({ message: 'Xóa tài khoản thành công' });
  } catch (err) {
    console.error('❌ Lỗi khi xóa user:', err);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};
