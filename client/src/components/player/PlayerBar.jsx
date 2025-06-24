import React, { useEffect, useRef, useState } from "react";
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
import heartedIcon from "../../assets/player-icons/hearted.png";
import playlistIcon from "../../assets/player-icons/playlist.png";
import slashIcon from "../../assets/player-icons/slash.png";

const PlayerBar = ({ currentSong, setCurrentSong }) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState(0); // 0 = off, 1 = all, 2 = one
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [isPlaylistMode, setIsPlaylistMode] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;

    audio.pause();
    audio.currentTime = 0;
    audio.load(); // ⚠️ ép reload
    audio.play().catch(console.error);

    setIsPlaying(true);
    const liked = likedSongs.some((s) => s._id === currentSong._id);
    setIsLiked(liked);
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (isPlaylistMode && likedSongs.length > 0) {
        const index = likedSongs.findIndex((s) => s._id === currentSong._id);
        const next = (index + 1) % likedSongs.length;
        setCurrentSong(likedSongs[next]);
      }
    };

    const update = () => setCurrentTime(audio.currentTime);
    const loaded = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", loaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", loaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentSong, likedSongs, isPlaylistMode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio && duration > 0) {
      const percent = (currentTime / duration) * 100;
      progressRef.current?.style.setProperty("--progress", `${percent}%`);
    }
  }, [currentTime, duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = loopMode === 2;
    isPlaying ? audio.play().catch(console.error) : audio.pause();
  }, [isPlaying, loopMode]);

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleLoopMode = () => {
    setLoopMode((prev) => (prev + 1) % 3);
  };

  const toggleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    if (next) {
      setLikedSongs((prev) => {
        if (!prev.find((s) => s._id === currentSong._id)) {
          return [currentSong, ...prev];
        }
        return prev;
      });
    } else {
      setLikedSongs((prev) => prev.filter((s) => s._id !== currentSong._id));
    }
  };

  const loopIconToShow =
    loopMode === 0 ? slashIcon : loopMode === 1 ? loopIcon : loop1Icon;

  if (!currentSong) return null;

  return (
    <>
      <Box className="player-container">
        <audio ref={audioRef} src={currentSong.audioUrl} />

        <Box className="progress-wrapper">
          <Typography variant="caption" className="progress-time">
            {Math.floor(currentTime / 60)}:
            {String(Math.floor(currentTime % 60)).padStart(2, "0")} /
            {Math.floor(duration / 60)}:
            {String(Math.floor(duration % 60)).padStart(2, "0")}
          </Typography>
          <input
            ref={progressRef}
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
          />
        </Box>

        <Box className="player-left">
          <img
            src={currentSong.imageUrl || discIcon}
            alt="cover"
            className="disc-icon"
          />
          <Box className="song-info">
            <Typography variant="body1" className="song-title">
              {currentSong.title}
            </Typography>
            <Typography variant="body2" className="song-artist">
              {currentSong.artist}
            </Typography>
          </Box>
        </Box>

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
          <button className="control-btn" onClick={toggleLoopMode}>
            <img src={loopIconToShow} alt="Loop" />
          </button>
        </Box>

        <Box className="player-right">
          <button className="control-btn" onClick={toggleLike}>
            <img src={isLiked ? heartedIcon : heartIcon} alt="Like" />
          </button>
          <button
            className="control-btn"
            onClick={() => setShowPlaylist(!showPlaylist)}
          >
            <img src={playlistIcon} alt="Playlist" />
          </button>
        </Box>
      </Box>

      {showPlaylist && (
        <Box className="floating-playlist">
          <Typography variant="h6" sx={{ px: 2, py: 1 }}>
            Playlist yêu thích
          </Typography>
          {likedSongs.length === 0 ? (
            <Typography variant="body2" sx={{ px: 2 }}>
              nothing here
            </Typography>
          ) : (
            likedSongs.map((song) => (
              <Box
                key={song._id}
                className="playlist-item"
                onClick={() => {
                  setCurrentSong(song);
                  setIsPlaylistMode(true);
                }}
              >
                <img
                  src={song.imageUrl}
                  alt={song.title}
                  className="playlist-img"
                />
                <Typography variant="body2" className="playlist-title">
                  {song.title}
                </Typography>
                <img
                  src={heartedIcon}
                  alt="hearted"
                  className="playlist-heart"
                />
              </Box>
            ))
          )}
        </Box>
      )}
    </>
  );
};

export default PlayerBar;
