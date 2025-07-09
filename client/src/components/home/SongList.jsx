import React from "react";
import { Box, Typography } from "@mui/material";
import SongCard from "../ui/SongCard";

const SongList = ({ songs, onSongClick }) => (
  <Box sx={{ bgcolor: "background.paper",borderRadius: 3,boxShadow: 3,p: 3,height: "100%",overflowY: "auto", marginTop: "-35px" }}>
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        marginBottom: 3,
        textAlign: "left",
        marginTop: "-5px",
        marginLeft: "45px",
        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
      }}
    >
      Danh sách bài hát
    </Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 250px)",
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