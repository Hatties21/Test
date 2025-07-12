import express from "express";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import {
  createSong,
  getSongs,
  getSongById,
  deleteSong,
  likeSong,
  unlikeSong,
  getUserLikedSongs,
  getRandomSong,
  searchSongs,
  getTopSongs
} from "../controllers/songController.js";

const router = express.Router();

// Middleware xác thực JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin user vào req
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.mimetype.startsWith("image/")
      ? path.join("uploads", "images")
      : path.join("uploads", "audios");
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const clean = (req.body.title || "untitled").replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );
    cb(null, clean + ext);
  },
});
const upload = multer({ storage });

// Routes
router.post(
  "/",
  authMiddleware, // Yêu cầu đăng nhập để tạo bài hát
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  createSong
);

router.get("/", authMiddleware, getSongs); // Thêm auth để lấy isLiked
router.get("/liked", authMiddleware, getUserLikedSongs); // Lấy danh sách yêu thích
router.get("/search", authMiddleware, searchSongs);
router.get("/random", authMiddleware, getRandomSong);
router.get('/top', getTopSongs);
router.delete("/:id",authMiddleware, deleteSong); // Xóa bài hát, yêu cầu đăng nhập);
router.get("/:id", authMiddleware, getSongById);
router.post("/:id/like", authMiddleware, likeSong);
router.delete("/:id/like", authMiddleware, unlikeSong);

export default router;
