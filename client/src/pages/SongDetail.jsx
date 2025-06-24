import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Avatar } from "@mui/material";

const SongDetail = () => {
  const { id } = useParams();
  const [song, setSong] = useState(null);

  useEffect(() => {
    axios.get(`/api/songs/${id}`)
      .then((res) => setSong(res.data))
      .catch((err) => console.error("Lỗi khi lấy bài hát:", err));
  }, [id]);

  if (!song) return <div>Đang tải bài hát...</div>;

  return (
    <Box display="flex" padding={4} gap={4}>
      {/* Bên trái: ảnh + tiêu đề + tác giả */}
      <Box textAlign="left" width="250px">
        <Avatar
          src={song.imageUrl}
          alt={song.title}
          variant="rounded"
          sx={{
            width: 200,
            height: 200,
            borderRadius: 3,
            marginBottom: 2,
            objectFit: "cover",
          }}
        />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {song.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {song.artist}
        </Typography>
      </Box>

      {/* Bên phải: mô tả */}
      <Box flex={1}>
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
  );
};

export default SongDetail;
