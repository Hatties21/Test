// src/pages/Top.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress
} from "@mui/material";
import songService from "../services/songService";

const Top = ({ setSongs, setCurrentIndex, setCurrentSong }) => {
  const [topSongs, setTopSongs] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await songService.fetchTopSongs(20);
        setTopSongs(data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy top songs:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" p={2}>
        Lỗi tải dữ liệu
      </Typography>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Top bài hát được yêu thích
      </Typography>

      <Paper elevation={1} sx={{ p: 2 }}>
        <List disablePadding>
          {topSongs.length > 0 ? (
            topSongs.map((song, idx) => (
              <ListItem
                key={song._id}
                button
                onClick={() => {
                  setSongs(topSongs);
                  setCurrentIndex(idx);
                  setCurrentSong(song);
                }}
                sx={{ mb: 1, borderRadius: 1 }}
              >
                {/* Số thứ tự */}
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Typography color="text.secondary">
                    {idx + 1}
                  </Typography>
                </ListItemIcon>

                {/* Ảnh bìa */}
                <ListItemAvatar>
                  <Avatar
                    variant="square"
                    src={song.imageUrl}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                </ListItemAvatar>

                {/* Thông tin bài hát */}
                <ListItemText
                  primary={song.title}
                  secondary={song.artist || song.username}
                />
              </ListItem>
            ))
          ) : (
            <Typography color="text.secondary" align="center">
              Chưa có dữ liệu
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Top;
