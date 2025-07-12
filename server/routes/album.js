import express from 'express';
import auth from '../middlewares/auth.js';


import {
  getAllAlbums,
  getMyAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addSongToAlbum,
  removeSongFromAlbum
} from '../controllers/albumController.js';

const router = express.Router();

// CRUD routes
router.get('/', getAllAlbums);
router.get('/me', auth, getMyAlbums);
router.get('/:id', getAlbumById);

// tạo mới (chỉ user đã auth)
router.post('/', auth, createAlbum);

// cập nhật (chỉ user đã auth)
router.put('/:id', auth, updateAlbum);


// xóa (chỉ user đã auth)
router.delete('/:id', auth, deleteAlbum);

router.post("/:id/songs", auth, addSongToAlbum);
router.delete("/:id/songs/:songId", auth, removeSongFromAlbum);


export default router;
