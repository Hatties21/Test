import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import "./player.css";

// ... (import các icons giữ nguyên) ...
import discIcon from "../../assets/player-icons/disc.png";
import playIcon from "../../assets/player-icons/play.png";
import pauseIcon from "../../assets/player-icons/pause.png";
import prevIcon from "../../assets/player-icons/prev.png";
import nextIcon from "../../assets/player-icons/next.png";
import shuffleIcon from "../../assets/player-icons/shuffle.png";
import loopIcon from "../../assets/player-icons/loop.png";
import loop1Icon from "../../assets/player-icons/loop1.png";
import volumeIcon from "../../assets/player-icons/volume.png";
import slashIcon from "../../assets/player-icons/slash.png";
import heartIcon from "../../assets/player-icons/heart.png";
import heartedIcon from "../../assets/player-icons/hearted.png";
import playlistIcon from "../../assets/player-icons/playlist.png";

const PlayerBar = ({ currentSong, setCurrentSong }) => {
  // Refs
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState(0); // 0 = off, 1 = all, 2 = one
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Playlist states
  const [likedSongs, setLikedSongs] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaylistMode, setIsPlaylistMode] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledPlaylist, setShuffledPlaylist] = useState([]);

  // Volume controls
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Auth token
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle token changes
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Fetch liked songs
  const fetchLikedSongs = useCallback(async () => {
    if (!token) {
      setLikedSongs([]);
      setIsPlaylistMode(false);
      return;
    }
    try {
      const { data } = await axios.get("/api/songs/liked", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLikedSongs(data);
    } catch (err) {
      setError("Failed to load liked songs");
      console.error("❌ Lỗi khi lấy danh sách yêu thích:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchLikedSongs();
  }, [fetchLikedSongs]);

  // Update like status
  useEffect(() => {
    if (!currentSong) return;
    const liked = likedSongs.some((s) => s._id === currentSong._id);
    setIsLiked(liked);
    setIsPlaylistMode(liked);
  }, [currentSong, likedSongs]);

  // Handle audio playback
  const handleAudioPlay = useCallback(async () => {
    if (!currentSong?.audioUrl || !audioRef.current) return;

    const audio = audioRef.current;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      setError("Playback failed. Please interact with page first.");
      console.error("Play error:", err);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [currentSong?.audioUrl]);

  // Load and play audio when song changes
  useEffect(() => {
    if (!currentSong?.audioUrl || !audioRef.current) return;

    const audio = audioRef.current;
    const prevSrc = audio.src.split("/").pop();
    const newSrc = currentSong.audioUrl.split("/").pop();

    if (prevSrc !== newSrc) {
      audio.pause();
      audio.src = currentSong.audioUrl;
      audio.load();
      handleAudioPlay();
    }
  }, [currentSong?.audioUrl, handleAudioPlay]);

  // Player event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      const progressPercent = (audio.currentTime / audio.duration) * 100 || 0;
      if (progressRef.current) {
        progressRef.current.style.setProperty(
          "--progress",
          `${progressPercent}%`
        );
      }
    };
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (!isPlaylistMode || likedSongs.length === 0) return;

      const list = isShuffled ? shuffledPlaylist : likedSongs;
      const currentIndex = list.findIndex((s) => s._id === currentSong._id);

      if (loopMode === 2) {
        audio.currentTime = 0;
        audio.play();
      } else if (currentIndex >= 0) {
        const nextIndex =
          loopMode === 1
            ? (currentIndex + 1) % list.length
            : currentIndex < list.length - 1
            ? currentIndex + 1
            : null;

        if (nextIndex !== null) {
          setCurrentSong(list[nextIndex]);
        } else {
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [
    currentSong,
    likedSongs,
    isPlaylistMode,
    loopMode,
    isShuffled,
    shuffledPlaylist,
    setCurrentSong,
  ]);

  // Play/pause and loop effects
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = loopMode === 2;
    isPlaying ? handleAudioPlay() : audioRef.current.pause();
  }, [isPlaying, loopMode, handleAudioPlay]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showVolumeSlider && !e.target.closest(".volume-control")) {
        setShowVolumeSlider(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showVolumeSlider]);

  // Player controls
  const handleSeek = (e) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleLoop = () => {
    setLoopMode((prev) => (prev + 1) % 3);
  };

  const toggleShuffle = useCallback(() => {
    if (!isShuffled && likedSongs.length > 0) {
      const rest = likedSongs.filter((s) => s._id !== currentSong._id);
      setShuffledPlaylist([
        currentSong,
        ...rest.sort(() => Math.random() - 0.5),
      ]);
    }
    setIsShuffled((prev) => !prev);
  }, [currentSong, isShuffled, likedSongs]);

  const handleNext = useCallback(() => {
    if (!isPlaylistMode || likedSongs.length === 0) return;
    const list = isShuffled ? shuffledPlaylist : likedSongs;
    const currentIndex = list.findIndex((s) => s._id === currentSong._id);
    if (currentIndex >= 0) {
      setCurrentSong(list[(currentIndex + 1) % list.length]);
    }
  }, [
    currentSong,
    isPlaylistMode,
    isShuffled,
    likedSongs,
    shuffledPlaylist,
    setCurrentSong,
  ]);

  const handlePrev = useCallback(() => {
    if (!isPlaylistMode || likedSongs.length === 0) return;
    const list = isShuffled ? shuffledPlaylist : likedSongs;
    const currentIndex = list.findIndex((s) => s._id === currentSong._id);
    if (currentIndex >= 0) {
      const prevIndex = currentIndex === 0 ? list.length - 1 : currentIndex - 1;
      setCurrentSong(list[prevIndex]);
    }
  }, [
    currentSong,
    isPlaylistMode,
    isShuffled,
    likedSongs,
    shuffledPlaylist,
    setCurrentSong,
  ]);

  // Like/unlike song
  const toggleLike = useCallback(async () => {
    if (!token || !currentSong) return;

    try {
      const method = isLiked ? "delete" : "post";
      await axios({
        method,
        url: `/api/songs/${currentSong._id}/like`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Optimistic update
      setIsLiked(!isLiked);
      setCurrentSong((prev) => ({
        ...prev,
        likesCount: prev.likesCount + (isLiked ? -1 : 1),
      }));

      // Refresh liked songs
      await fetchLikedSongs();
    } catch (err) {
      setError("Failed to update like status");
      console.error("❌ Lỗi khi cập nhật lượt thích:", err);
      // Rollback optimistic update
      setIsLiked(isLiked);
    } finally {
      setIsLoading(false);
    }
  }, [token, currentSong, isLiked, fetchLikedSongs, setCurrentSong]);

  if (!currentSong) return null;

  const loopIconToShow =
    loopMode === 0 ? slashIcon : loopMode === 1 ? loopIcon : loop1Icon;

  return (
    <>
      <Box className="player-container">
        <audio ref={audioRef} src={currentSong.audioUrl} preload="auto" />

        {/* Loading indicator */}
        {isLoading && (
          <Box className="player-loading">
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Progress bar */}
        <Box className="progress-wrapper">
          <Typography className="progress-time" variant="caption">
            {formatTime(currentTime)} / {formatTime(duration)}
          </Typography>
          <input
            ref={progressRef}
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
          />
        </Box>

        {/* Left section - Song info */}
        <Box className="player-left">
          <img
            src={currentSong.imageUrl || discIcon}
            alt="cover"
            className="disc-icon"
            onError={(e) => {
              e.target.src = discIcon;
            }}
          />
          <Box className="song-info">
            <Typography className="song-title" variant="body1" noWrap>
              {currentSong.title || "Unknown Title"}
            </Typography>
            <Typography className="song-artist" variant="body2" noWrap>
              {currentSong.artist || "Unknown Artist"}
            </Typography>
            <Typography className="likes-count" variant="caption">
              {currentSong.likesCount ?? 0} lượt thích
            </Typography>
          </Box>
        </Box>

        {/* Center section - Player controls */}
        <Box className="player-center">
          <button
            className={`control-btn ${isShuffled ? "active" : ""}`}
            onClick={toggleShuffle}
            disabled={!isPlaylistMode}
          >
            <img src={shuffleIcon} alt="Shuffle" />
          </button>
          <button
            className="control-btn"
            onClick={handlePrev}
            disabled={!isPlaylistMode}
          >
            <img src={prevIcon} alt="Previous" />
          </button>
          <button
            className="play-btn"
            onClick={togglePlayPause}
            disabled={isLoading}
          >
            <img
              src={isPlaying ? pauseIcon : playIcon}
              alt={isPlaying ? "Pause" : "Play"}
            />
          </button>
          <button
            className="control-btn"
            onClick={handleNext}
            disabled={!isPlaylistMode}
          >
            <img src={nextIcon} alt="Next" />
          </button>
          <button className="control-btn" onClick={toggleLoop}>
            <img src={loopIconToShow} alt="Loop" />
          </button>
        </Box>

        {/* Right section - Additional controls */}
        <Box className="player-right">
          <Box className="volume-control">
            <button
              className="control-btn"
              onClick={() => setShowVolumeSlider((s) => !s)}
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
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setVolume(v);
                  setIsMuted(v === 0);
                }}
                className="volume-slider"
              />
            )}
          </Box>

          <button
            className="control-btn"
            onClick={toggleLike}
            disabled={!token || isLoading}
          >
            <img
              src={isLiked ? heartedIcon : heartIcon}
              alt={isLiked ? "Unlike" : "Like"}
            />
          </button>
          <button
            className={`control-btn ${isPlaylistMode ? "active" : ""}`}
            onClick={() => setShowPlaylist((s) => !s)}
          >
            <img src={playlistIcon} alt="Playlist" />
          </button>
        </Box>
      </Box>

      {/* Playlist popup */}
      {showPlaylist && (
        <Box className="floating-playlist">
          <Typography variant="h6" sx={{ px: 2, py: 1 }}>
            Playlist yêu thích
          </Typography>
          {likedSongs.length === 0 ? (
            <Typography variant="body2" sx={{ px: 2 }}>
              Không có bài hát nào
            </Typography>
          ) : (
            likedSongs.map((song) => (
              <Box
                key={song._id}
                className={`playlist-item ${
                  currentSong._id === song._id ? "active" : ""
                }`}
                onClick={() => setCurrentSong(song)}
              >
                <img
                  src={song.imageUrl || discIcon}
                  alt={song.title}
                  className="playlist-img"
                  onError={(e) => {
                    e.target.src = discIcon;
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" className="playlist-title" noWrap>
                    {song.title}
                  </Typography>
                  <Typography variant="caption" className="playlist-likes">
                    {song.likesCount} lượt thích
                  </Typography>
                </Box>
                {currentSong._id === song._id && (
                  <img
                    src={heartedIcon}
                    alt="hearted"
                    className="playlist-heart"
                  />
                )}
              </Box>
            ))
          )}
        </Box>
      )}

      {/* Error notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PlayerBar;
