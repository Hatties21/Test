import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import songApi from "../api/songApi";

const Explore = ({ setCurrentSong, setSongs, setCurrentIndex }) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm fetch bài hát ngẫu nhiên, dùng useCallback để ổn định reference
  const fetchRandom = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await songApi.getRandomSong();
      setSong(data);
      // Cập nhật PlayerBar
      setCurrentSong(data);
      setSongs([data]);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Lỗi khi lấy bài ngẫu nhiên:", err);
      setSong(null);
    } finally {
      setLoading(false);
    }
  }, [setCurrentSong, setSongs, setCurrentIndex]);

  // Khi component mount, gọi fetchRandom
  useEffect(() => {
    fetchRandom();
  }, [fetchRandom]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography>Đang tải bài hát ngẫu nhiên…</Typography>
      </Box>
    );
  }

  if (!song) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Không có bài hát nào</Typography>
        <Button variant="contained" onClick={fetchRandom} sx={{ mt: 2 }}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>Khám Phá</Typography>

      <Box
        component="img"
        src={song.imageUrl}
        alt={song.title}
        sx={{ width: 300, borderRadius: 2, mb: 2 }}
      />

      <Typography variant="h6">
        {song.title} &ndash; {song.artist}
      </Typography>

      <Button variant="contained" onClick={fetchRandom} sx={{ mt: 3 }}>
        Bài khác
      </Button>
    </Box>
  );
};

export default Explore;
