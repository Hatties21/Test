import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import './player.css';

// Import tất cả icon từ thư mục assets trong component
import discIcon from '../../assets/player-icons/disc.png';
import playIcon from '../../assets/player-icons/play.png';
import pauseIcon from '../../assets/player-icons/pause.png';
import prevIcon from '../../assets/player-icons/prev.png';
import nextIcon from '../../assets/player-icons/next.png';
import shuffleIcon from '../../assets/player-icons/shuffle.png';
import loopIcon from '../../assets/player-icons/loop.png';
import volumeIcon from '../../assets/player-icons/volume.png';
import heartIcon from '../../assets/player-icons/heart.png';
import playlistIcon from '../../assets/player-icons/playlist.png';

const PlayerBar = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong,] = useState({
    title: "Blinding Lights",
    artist: "The Weeknd",
  });

  return (
    <Box className="player-container">
      {/* Phần bên trái - Thông tin bài hát */}
      <Box className="player-left">
        <img src={discIcon} alt="Album cover" className="disc-icon" />
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
          <img src={shuffleIcon} alt="Shuffle" />
        </button>
        <button className="control-btn">
          <img src={prevIcon} alt="Previous" />
        </button>
        <button 
          className="play-btn" 
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <img src={isPlaying ? pauseIcon : playIcon} alt="Play/Pause" />
        </button>
        <button className="control-btn">
          <img src={nextIcon} alt="Next" />
        </button>
        <button className="control-btn">
          <img src={loopIcon} alt="Loop" />
        </button>
      </Box>

      {/* Phần bên phải - Các chức năng khác */}
      <Box className="player-right">
        <button className="control-btn">
          <img src={volumeIcon} alt="Volume" />
        </button>
        <button className="control-btn">
          <img src={heartIcon} alt="Favorite" />
        </button>
        <button className="control-btn">
          <img src={playlistIcon} alt="Playlist" />
        </button>
      </Box>
    </Box>
  );
};

export default PlayerBar;