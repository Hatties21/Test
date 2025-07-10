import React from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useAlbum } from "../hooks";
import AlbumSongList from "../components/ui/AlbumSongList";

// File: client/src/pages/Album.jsx
const Album = ({ setCurrentSong }) => {
  const { albums, selectedAlbum, handleAlbumChange, songs, loading } = useAlbum();

  if (loading) return <div>Đang tải album...</div>;
  if (!albums.length) return <div>Không tìm thấy album</div>;

  return (
    <Box sx={{ p: 4, marginTop: "-35px" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Danh sách Album
      </Typography>
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Chọn Album</InputLabel>
        <Select
          value={selectedAlbum || ""}
          onChange={(e) => handleAlbumChange(e.target.value)}
          label="Chọn Album"
        >
          <MenuItem value="">-- Chọn --</MenuItem>
          {albums.map((album) => (
            <MenuItem key={album._id} value={album._id}>
              {album.title} ({album.artist || album.uploader})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedAlbum && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Bài hát trong album
          </Typography>
          <AlbumSongList songs={songs} setCurrentSong={setCurrentSong} />
        </Box>
      )}
      <Box sx={{ height: "80px" }} />
    </Box>
  );
};

export default Album;