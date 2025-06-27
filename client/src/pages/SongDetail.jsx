import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Avatar } from "@mui/material";
import SongCard from "../components/ui/SongCard";

const SongDetail = ({ setCurrentSong }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomSongs, setRandomSongs] = useState([]);

  const fetchSongs = async () => {
    try {
      const res = await axios.get(`/api/songs`);
      setSongs(res.data.songs);
    } catch (err) {
      console.error("Lỗi khi lấy bài hát:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchSongs();
    }, []);


  useEffect(() => {
    // Lấy thông tin bài hát chi tiết
    axios.get(`/api/songs/${id}`)
      .then((res) => setSong(res.data))
      .catch((err) => console.error("Lỗi khi lấy bài hát:", err));

    // Lấy tất cả bài hát và chọn ngẫu nhiên 3 bài
    axios.get("/api/songs")
      .then((res) => {
        const allSongs = res.data.songs || res.data;
        // Lọc bỏ bài hát hiện tại
        const filteredSongs = allSongs.filter(s => s._id !== id);
        // Xáo trộn mảng và lấy 3 bài đầu tiên
        const shuffled = [...filteredSongs].sort(() => 0.5 - Math.random());
        setRandomSongs(shuffled.slice(0, 2));
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách bài hát:", err));
  }, [id]);

  if (!song) return <div>Đang tải bài hát...</div>;

  return (
    <Box sx={{ position: "relative", padding: 4 }}>
      {/* Phần chính */}
      <Box display="flex" gap={4}>
        {/* Bên trái: ảnh + tiêu đề + tác giả */}
        <Box textAlign="left" width="250px" sx={{ position: "relative" }}>
          <Avatar
            src={song.imageUrl}
            alt={song.title}
            variant="rounded"
            sx={{
              position: "absolute",
              top: "50px",
              left: "90px",
              width: 200,
              height: 200,
              borderRadius: 3,
              marginBottom: 2,
              objectFit: "cover",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "260px",
              left: "90px",
              width: "200px",
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {song.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {song.artist}
            </Typography>
          </Box>
        </Box>

        {/* Bên phải: mô tả */}
        <Box
          flex={1}
          sx={{
            marginLeft: "75px",
            marginTop: "50px",
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Mô tả
          </Typography>
          <Typography
            variant="body1"
            whiteSpace="pre-line"
            sx={{ fontSize: "15px", lineHeight: 1.7 }}
          >
            {song.description || "Không có mô tả cho bài hát này."}
          </Typography>
        </Box>
      </Box>

      {/* Floating box - Bài hát ngẫu nhiên */}
      <Box
        sx={{
          position: "fixed",
          top: "150px",
          right: "50px",
          width: "350px",
          padding: 3,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
          zIndex: 1000,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: "bold" }}>
          Có thể bạn quan tâm
        </Typography>
        
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {randomSongs.map((song) => (
            <SongCard
              key={song._id}
              song={song}
              onClick={() => {
                if (setCurrentSong) setCurrentSong(song);
                navigate(`/song/${song._id}`);
              }}
              compact
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ height: "80px" }} />
    </Box>
  );
};

export default SongDetail;