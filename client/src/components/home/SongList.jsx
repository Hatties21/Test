import React from "react";
import { Box, Typography } from "@mui/material";
import SongCard from "../ui/SongCard";

const SongList = ({ songs, onSongClick }) => (
  <Box sx={{ width: "100%", padding: "20px 40px" }}>
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        marginBottom: 3,
        textAlign: "center",
        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
      }}
    >
      Danh sách bài hát
    </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 300px)",
        columnGap: "20px",
        rowGap: "20px",
        justifyContent: "center",
      }}
    >
      {songs.map((song) => (
        <SongCard
          key={song._id}
          song={song}
          onClick={() => onSongClick(song)}
        />
      ))}
    </Box>
  </Box>
);

export default SongList;