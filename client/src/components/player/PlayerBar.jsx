import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import "./player.css";

import discIcon from "../../assets/player-icons/disc.png";
import playIcon from "../../assets/player-icons/play.png";
import pauseIcon from "../../assets/player-icons/pause.png";
import prevIcon from "../../assets/player-icons/prev.png";
import nextIcon from "../../assets/player-icons/next.png";
import shuffleIcon from "../../assets/player-icons/shuffle.png";
import loopIcon from "../../assets/player-icons/loop.png";
import loop1Icon from "../../assets/player-icons/loop1.png";
import volumeIcon from "../../assets/player-icons/volume.png";
import heartIcon from "../../assets/player-icons/heart.png";
import playlistIcon from "../../assets/player-icons/playlist.png";

const PlayerBar = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // bắt đầu từ 0 giây
  const [duration, setDuration] = useState(202); // ví dụ: 3:22

  const currentSong = {
    title: "Once Upon a Time in the West",
    artist: "Ennio Morricone",
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  return (
    <Box className="player-container">
      {/* Progress Bar */}
      <Box className="progress-wrapper">
        <Typography variant="caption" className="progress-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </Typography>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => setCurrentTime(Number(e.target.value))}
          className="progress-bar"
        />
      </Box>

      {/* Left: Song info */}
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

      {/* Center: Controls */}
      <Box className="player-center">
        <button className="control-btn">
          <img src={shuffleIcon} alt="Shuffle" />
        </button>
        <button className="control-btn">
          <img src={prevIcon} alt="Previous" />
        </button>
        <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
          <img src={isPlaying ? pauseIcon : playIcon} alt="Play/Pause" />
        </button>
        <button className="control-btn">
          <img src={nextIcon} alt="Next" />
        </button>
        <button
          className="control-btn"
          onClick={() => setIsLooping(!isLooping)}
        >
          <img src={isLooping ? loop1Icon : loopIcon} alt="Loop" />
        </button>
      </Box>

      {/* Right: Extra controls */}
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
