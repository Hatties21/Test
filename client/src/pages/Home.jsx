import React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useHomeSongs} from "../hooks";
import {SongList, SongSlider} from "../components/home";
import {AddSongButton} from "../components/ui";

const Home = ({ setCurrentSong }) => {
  const navigate = useNavigate();
  const {
    songs,
    currentIndex,
    loading,
    handleSongAdded,
    handleSubCardClick,
  } = useHomeSongs();

  const handleMainCardClick = () => {
    if (songs[currentIndex]) {
      setCurrentSong(songs[currentIndex]);
      navigate(`/song/${songs[currentIndex]._id}`);
    }
  };

  const handleSongClick = (song) => {
    setCurrentSong(song);
    navigate(`/song/${song._id}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        width: "100%",
        position: "relative",
        marginTop: "-35px",
      }}
    >
      {!loading && songs.length > 0 && (
        <SongSlider
          songs={songs}
          currentIndex={currentIndex}
          onMainClick={handleMainCardClick}
          onSubClick={handleSubCardClick}
        />
      )}
      

      <Box sx={{ width: "65%", alignSelf: "flex-start", marginLeft: "80px" }}>
        <SongList songs={songs} onSongClick={handleSongClick} />
      </Box>
      
      

      <AddSongButton onSongAdded={handleSongAdded} />
      
      <Box sx={{ height: "90px" }} />
    </Box>
  );
};

export default Home;