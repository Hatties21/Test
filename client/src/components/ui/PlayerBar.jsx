import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import './player.css';

const PlayerBar = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({
    title: "Blinding Lights",
    artist: "The Weeknd",
    cover: "/assets/disc.png"
  });

  return (
    <Box className="player-container">
      {/* Phần bên trái - Thông tin bài hát */}
      <Box className="player-left">
        <img src={currentSong.cover} alt="Album cover" className="disc-icon" />
        <Box className="song-info">
          <Typography variant="body1" className="song-title">
            {currentSong.title}
          </Typography>
          <Typography variant="body2" className="song-artist">
            {currentSong.artist}
          </Typography>
        </Box>
      </Box>

      {/* Phần giữa - Điều khiển phát nhạc */}
      <Box className="player-center">
        <button className="control-btn">
          <img src="/assets/shuffle.png" alt="Shuffle" />
        </button>
        <button className="control-btn">
          <img src="/assets/prev.png" alt="Previous" />
        </button>
        <button 
          className="play-btn" 
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <img src={isPlaying ? "/assets/pause.png" : "/assets/play.png"} alt="Play/Pause" />
        </button>
        <button className="control-btn">
          <img src="/assets/next.png" alt="Next" />
        </button>
        <button className="control-btn">
          <img src="/assets/loop.png" alt="Loop" />
        </button>
      </Box>

      {/* Phần bên phải - Các chức năng khác */}
      <Box className="player-right">
        <button className="control-btn">
          <img src="/assets/volume.png" alt="Volume" />
        </button>
        <button className="control-btn">
          <img src="/assets/heart.png" alt="Favorite" />
        </button>
        <button className="control-btn">
          <img src="/assets/playlist.png" alt="Playlist" />
        </button>
      </Box>
    </Box>
  );
};

export default PlayerBar;