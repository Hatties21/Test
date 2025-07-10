import React from "react";
import { Box } from "@mui/material";
import SongCard from "./SongCard";
import { useNavigate } from "react-router-dom";

// File: client/src/components/ui/AlbumSongList.jsx
const AlbumSongList = ({ songs, setCurrentSong }) => {
  const navigate = useNavigate();

  const handleSongClick = (song) => {
    setCurrentSong(song);
    navigate(`/song/${song._id}`);
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
      {songs.length > 0 ? (
        songs.map((song) => (
          <SongCard
            key={song._id}
            song={song}
            onClick={() => handleSongClick(song)}
          />
        ))
      ) : (
        <div>Không có bài hát trong album này</div>
      )}
    </Box>
  );
};

export default AlbumSongList;