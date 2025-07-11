import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import songApi from "../api/songApi";

const Explore = ({
  currentSong,
  songs,
  currentIndex,
  setCurrentSong,
  setSongs,
  setCurrentIndex
}) => {
  const [loading, setLoading] = useState(false);

  const fetchRandom = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await songApi.getRandomSong();
      setCurrentSong(data);
      setSongs([data]);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Lỗi khi lấy bài ngẫu nhiên:", err);
    } finally {
      setLoading(false);
    }
  }, [setCurrentSong, setSongs, setCurrentIndex]);

  // Chỉ auto-fetch khi chưa có bài nào đang play
  useEffect(() => {
    if (!currentSong) {
      fetchRandom();
    }
  }, [fetchRandom, currentSong]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography>Đang tải bài hát ngẫu nhiên…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Khám Phá
      </Typography>

      {currentSong ? (
        <>
          <Box
            component="img"
            src={currentSong.imageUrl}
            alt={currentSong.title}
            sx={{ width: 300, borderRadius: 2, mb: 2 }}
          />
          <Typography variant="h6">
            {currentSong.title} – {currentSong.artist}
          </Typography>
        </>
      ) : (
        <Typography>Chưa có bài nào.</Typography>
      )}

      <Button variant="contained" onClick={fetchRandom} sx={{ mt: 3 }}>
        {currentSong ? "Bài khác" : "Tải ngẫu nhiên"}
      </Button>
    </Box>
  );
};

export default Explore;
