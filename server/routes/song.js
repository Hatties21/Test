import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createSong,
  getSongs,
  getSongById,
} from '../controllers/songController.js';

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.mimetype.startsWith('image/')
      ? path.join('uploads','images')
      : path.join('uploads','audios');
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext   = path.extname(file.originalname);
    const clean = (req.body.title||'untitled')
                    .replace(/[^a-zA-Z0-9_-]/g,'_');
    cb(null, clean + ext);
  }
});
const upload = multer({ storage });

// Routes
router.post(
  '/', 
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  createSong
);

router.get('/',       getSongs);
router.get('/:id',    getSongById);

export default router;
