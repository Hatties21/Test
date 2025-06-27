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
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledPlaylist, setShuffledPlaylist] = useState([]);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;

    audio.pause();
    audio.currentTime = 0;
    audio.load();
    audio.play().catch(console.error);

    setIsPlaying(true);
    const liked = likedSongs.some((s) => s._id === currentSong._id);
    setIsLiked(liked);
  }, [currentSong]);

  useEffect(() => {
    if (currentSong && likedSongs.length > 0) {
      const isInPlaylist = likedSongs.some((s) => s._id === currentSong._id);
      setIsPlaylistMode(isInPlaylist);
    }
  }, [currentSong, likedSongs]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (isPlaylistMode && likedSongs.length > 0) {
        if (loopMode === 1) {
          handleNext();
        } else if (loopMode === 0) {
          const currentList = isShuffled ? shuffledPlaylist : likedSongs;
          const index = currentList.findIndex((s) => s._id === currentSong._id);
          if (index === currentList.length - 1) {
            setIsPlaying(false);
          } else {
            handleNext();
          }
        }
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
  }, [
    currentSong,
    likedSongs,
    isPlaylistMode,
    loopMode,
    isShuffled,
    shuffledPlaylist,
  ]);

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (showVolumeSlider && !e.target.closest('.volume-control')) {
      setShowVolumeSlider(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [showVolumeSlider]);

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleLoopMode = () => {
    setLoopMode((prev) => (prev + 1) % 3);
  };

  const toggleShuffle = () => {
    if (!isShuffled && likedSongs.length > 0) {
      // Tạo bản sao của playlist và xáo trộn
      const shuffled = [...likedSongs]
        .filter((song) => song._id !== currentSong._id)
        .sort(() => Math.random() - 0.5);
      setShuffledPlaylist([currentSong, ...shuffled]);
    }
    setIsShuffled(!isShuffled);
  };

  const handleNext = () => {
    if (!isPlaylistMode || likedSongs.length === 0) return;

    const currentList = isShuffled ? shuffledPlaylist : likedSongs;
    const currentIndex = currentList.findIndex(
      (s) => s._id === currentSong._id
    );

    if (currentIndex === -1) return;

    const nextIndex = (currentIndex + 1) % currentList.length;
    setCurrentSong(currentList[nextIndex]);
  };

  const handlePrev = () => {
    if (!isPlaylistMode || likedSongs.length === 0) return;

    const currentList = isShuffled ? shuffledPlaylist : likedSongs;
    const currentIndex = currentList.findIndex(
      (s) => s._id === currentSong._id
    );

    if (currentIndex === -1) return;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = currentList.length - 1;

    setCurrentSong(currentList[prevIndex]);
  };

  const toggleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    if (next) {
      setLikedSongs((prev) => {
        if (!prev.find((s) => s._id === currentSong._id)) {
          // Tự động bật playlist mode khi thêm bài hát đầu tiên
          if (prev.length === 0) {
            setIsPlaylistMode(true);
          }
          return [currentSong, ...prev];
        }
        return prev;
      });
    } else {
      setLikedSongs((prev) => {
        const newPlaylist = prev.filter((s) => s._id !== currentSong._id);
        // Tự động tắt playlist mode khi không còn bài hát nào
        if (newPlaylist.length === 0) {
          setIsPlaylistMode(false);
        }
        return newPlaylist;
      });
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
  setIsMuted(!isMuted);
  // Mở slider khi click vào nút volume nếu đang đóng
  if (!showVolumeSlider) {
    setShowVolumeSlider(true);
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
          <button
            className={`control-btn ${isShuffled ? "active" : ""}`}
            onClick={toggleShuffle}
          >
            <img src={shuffleIcon} alt="Shuffle" />
          </button>
          <button className="control-btn" onClick={handlePrev}>
            <img src={prevIcon} alt="Previous" />
          </button>
          <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
            <img src={isPlaying ? pauseIcon : playIcon} alt="Play/Pause" />
          </button>
          <button className="control-btn" onClick={handleNext}>
            <img src={nextIcon} alt="Next" />
          </button>
          <button className="control-btn" onClick={toggleLoopMode}>
            <img src={loopIconToShow} alt="Loop" />
          </button>
        </Box>

        <Box className="player-right">
          <Box className="volume-control">
            <button
              className="control-btn"
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            >
              <img src={isMuted ? slashIcon : volumeIcon} alt="Volume" />
            </button>
            {showVolumeSlider && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            )}
          </Box>
          <button className="control-btn" onClick={toggleLike}>
            <img src={isLiked ? heartedIcon : heartIcon} alt="Like" />
          </button>
          <button
            className={`control-btn ${isPlaylistMode ? "active" : ""}`}
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
                className={`playlist-item ${
                  currentSong._id === song._id ? "active" : ""
                }`}
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
