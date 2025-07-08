import { useState, useEffect } from "react";
import songService from "../services/songService";

const useHomeSongs = () => {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadSongs = async (pageNum = 1) => {
    setLoading(true);
    try {
      const data = await songService.fetchSongs(pageNum);
      setSongs(data.songs);
      setPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error loading songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSongAdded = (newSong) => {
    setSongs((prev) => [newSong, ...prev]);
  };

  const handleSubCardClick = (direction) => {
    const total = songs.length;
    setCurrentIndex((prev) => {
      if (direction === "left") return (prev - 1 + total) % total;
      if (direction === "right") return (prev + 1) % total;
      return prev;
    });
  };

  useEffect(() => {
    loadSongs();
  }, []);

  return {
    songs,
    currentIndex,
    loading,
    page,
    totalPages,
    handleSongAdded,
    handleSubCardClick,
    loadSongs,
  };
};

export default useHomeSongs;