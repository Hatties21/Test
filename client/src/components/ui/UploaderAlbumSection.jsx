import React from "react";
import { Box, Typography } from "@mui/material";
import SongCard from "./SongCard";

/**
 * Section album theo người đăng tải
 */
const UploaderAlbumSection = ({
  uploader,
  songs,
  setCurrentSong,
  setSongs,
  setCurrentIndex,
}) => (
  <Box mb={4}>
    <Typography variant="h5" gutterBottom>
      Người đăng tải: <strong>{uploader}</strong>
    </Typography>
    <Box display="flex" flexWrap="wrap" gap={2}>
      {songs.map((song, idx) => (
        <SongCard
          key={song._id}
          song={song}
          onClick={() => {
            setSongs(songs);
            setCurrentIndex(idx);
            setCurrentSong(song);
          }}
        />
      ))}
    </Box>
  </Box>
);

export default UploaderAlbumSection;
