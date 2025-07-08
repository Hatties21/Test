import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import SongCard from "../components/ui/SongCard";
import { useSongDetail } from "../hooks";

// File: client/src/pages/SongDetail.jsx
// Chỉ còn chịu trách nhiệm render, logic đã dời hết vào hook useSongDetail
const SongDetail = ({ setCurrentSong }) => {
  const { song, randomSongs, loading, handleRandomClick } =
    useSongDetail(setCurrentSong);

  if (loading) return <div>Đang tải bài hát...</div>;
  if (!song) return <div>Không tìm thấy bài hát</div>;

  return (
    <Box sx={{ position: "relative", p: 4 }}>
      <Box display="flex" gap={4}>
        <Box position="relative" width="250px" textAlign="left">
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

        <Box flex={1} sx={{ ml: "75px", mt: "50px" }}>
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

      <Box
        sx={{
          position: "fixed",
          top: "150px",
          right: "50px",
          width: "350px",
          p: 3,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
          zIndex: 1000,
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Có thể bạn quan tâm
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {randomSongs.map((s) => (
            <SongCard
              key={s._id}
              song={s}
              onClick={() => handleRandomClick(s)}
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ height: "80px" }} />
    </Box>
  );
};

export default SongDetail;
