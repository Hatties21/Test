import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
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
import slashIcon from "../../assets/player-icons/slash.png";
import heartIcon from "../../assets/player-icons/heart.png";
import heartedIcon from "../../assets/player-icons/hearted.png";
import playlistIcon from "../../assets/player-icons/playlist.png";

const PlayerBar = ({ currentSong, setCurrentSong }) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState(0); // 0 = off, 1 = all, 2 = one
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [likedSongs, setLikedSongs] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaylistMode, setIsPlaylistMode] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledPlaylist, setShuffledPlaylist] = useState([]);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Theo dõi token để fetch lại likedSongs mỗi khi user login/logout
  const [token, setToken] = useState(localStorage.getItem("token"));
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Fetch liked songs mỗi khi token thay đổi
  useEffect(() => {
    const fetchLiked = async () => {
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
        console.error("❌ Lỗi khi lấy danh sách yêu thích:", err);
      }
    };
    fetchLiked();
  }, [token]);

  // Đồng bộ isLiked và isPlaylistMode khi currentSong hoặc likedSongs thay đổi
  useEffect(() => {
    if (!currentSong) return;
    const liked = likedSongs.some((s) => s._id === currentSong._id);
    setIsLiked(liked);
    setIsPlaylistMode(liked);
  }, [currentSong, likedSongs]);

  // Khi đổi bài hoặc status play, load và play audio
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    audio.load();
    audio.play().catch(console.error);
    setIsPlaying(true);
  }, [currentSong]);

  // Cập nhật progress, duration, và xử lý khi hết bài
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoad = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (!isPlaylistMode || likedSongs.length === 0) return;
      const list = isShuffled ? shuffledPlaylist : likedSongs;
      const idx = list.findIndex((s) => s._id === currentSong._id);
      if (loopMode === 2) {
        audio.currentTime = 0;
        audio.play();
      } else if (idx >= 0) {
        const nextIdx =
          loopMode === 1
            ? (idx + 1) % list.length
            : idx === list.length - 1
            ? null
            : idx + 1;
        if (nextIdx !== null) setCurrentSong(list[nextIdx]);
        else setIsPlaying(false);
      }
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoad);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoad);
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

  // Áp dụng play/pause và loopMode
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = loopMode === 2;
    isPlaying
      ? audioRef.current.play().catch(console.error)
      : audioRef.current.pause();
  }, [isPlaying, loopMode]);

  // Volume/Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Đóng slider khi click ngoài
  useEffect(() => {
    const onClick = (e) => {
      if (showVolumeSlider && !e.target.closest(".volume-control")) {
        setShowVolumeSlider(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showVolumeSlider]);

  const handleSeek = (e) => {
    const t = Number(e.target.value);
    audioRef.current.currentTime = t;
    setCurrentTime(t);
  };
  const toggleLoop = () => setLoopMode((m) => (m + 1) % 3);
  const toggleShuffle = () => {
    if (!isShuffled && likedSongs.length > 0) {
      const rest = likedSongs.filter((s) => s._id !== currentSong._id);
      setShuffledPlaylist([
        currentSong,
        ...rest.sort(() => Math.random() - 0.5),
      ]);
    }
    setIsShuffled((f) => !f);
  };
  const handleNext = () => {
    if (!isPlaylistMode || likedSongs.length === 0) return;
    const list = isShuffled ? shuffledPlaylist : likedSongs;
    const idx = list.findIndex((s) => s._id === currentSong._id);
    if (idx >= 0) setCurrentSong(list[(idx + 1) % list.length]);
  };
  const handlePrev = () => {
    if (!isPlaylistMode || likedSongs.length === 0) return;
    const list = isShuffled ? shuffledPlaylist : likedSongs;
    const idx = list.findIndex((s) => s._id === currentSong._id);
    if (idx >= 0) {
      const prev = idx === 0 ? list.length - 1 : idx - 1;
      setCurrentSong(list[prev]);
    }
  };

  // Gọi API like/unlike rồi fetch lại danh sách likedSongs
  const toggleLike = async () => {
  if (!token || !currentSong) return;
  try {
    const method = isLiked ? "delete" : "post";
    await axios({
      method,
      url: `/api/songs/${currentSong._id}/like`,
      headers: { Authorization: `Bearer ${token}` },
    });
    // Fetch lại danh sách likedSongs
    const { data } = await axios.get("/api/songs/liked", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLikedSongs(data);

    // Chỉ cập nhật isLiked và likesCount, không gọi setCurrentSong
    setIsLiked(!isLiked);
    setCurrentSong((prev) => ({
      ...prev,
      likesCount: prev.likesCount + (isLiked ? -1 : 1),
    }));
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật lượt thích:", err);
  }
};

  if (!currentSong) return null;
  const loopIconToShow =
    loopMode === 0 ? slashIcon : loopMode === 1 ? loopIcon : loop1Icon;

  return (
    <>
      <Box className="player-container">
        <audio ref={audioRef} src={currentSong.audioUrl} />

        <Box className="progress-wrapper">
          <Typography className="progress-time" variant="caption">
            {Math.floor(currentTime / 60)}:
            {String(Math.floor(currentTime % 60)).padStart(2, "0")} /{" "}
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
            <Typography className="song-title" variant="body1">
              {currentSong.title}
            </Typography>
            <Typography className="song-artist" variant="body2">
              {currentSong.artist}
            </Typography>
            <Typography className="likes-count" variant="caption">
              {currentSong.likesCount} lượt thích
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
          <button className="play-btn" onClick={() => setIsPlaying((p) => !p)}>
            <img src={isPlaying ? pauseIcon : playIcon} alt="Play/Pause" />
          </button>
          <button className="control-btn" onClick={handleNext}>
            <img src={nextIcon} alt="Next" />
          </button>
          <button className="control-btn" onClick={toggleLoop}>
            <img src={loopIconToShow} alt="Loop" />
          </button>
        </Box>

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

          <button className="control-btn" onClick={toggleLike}>
            <img src={isLiked ? heartedIcon : heartIcon} alt="Like" />
          </button>
          <button
            className={`control-btn ${isPlaylistMode ? "active" : ""}`}
            onClick={() => setShowPlaylist((s) => !s)}
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
              Không có bài hát nào
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
                <Typography variant="caption" className="playlist-likes">
                  {song.likesCount} lượt thích
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
