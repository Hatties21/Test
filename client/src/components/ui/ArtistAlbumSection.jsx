import React from "react";
import { Box, Typography } from "@mui/material";
import SongCard from "./SongCard";

/**
 * Section album theo artist
 */
const ArtistAlbumSection = ({
  artist,
  songs,
  setCurrentSong,
  setSongs,
  setCurrentIndex,
}) => (
  <Box mb={4}>
    <Typography variant="h5" gutterBottom>
      Tác giả: <strong>{artist}</strong>
    </Typography>
    <Box display="flex" flexWrap="wrap" gap={2}>
      {songs.map((song, idx) => (
        <SongCard
          key={song._id}
          song={song}
          onClick={() => {
            setSongs(songs);       // cập nhật playlist
            setCurrentIndex(idx);  // xác định vị trí bài nhạc
            setCurrentSong(song);  // play bài đã chọn
          }}
        />
      ))}
    </Box>
  </Box>
);

export default ArtistAlbumSection;
