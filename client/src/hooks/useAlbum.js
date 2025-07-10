import { useState, useEffect } from "react";
import { getAlbums, getSongsByAlbum } from "../services/albumService";

// File: client/src/hooks/useAlbum.js
export const useAlbum = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await getAlbums();
        setAlbums(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách album:", error);
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!selectedAlbum) {
        setSongs([]);
        return;
      }
      try {
        setLoading(true);
        const response = await getSongsByAlbum(selectedAlbum);
        setSongs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy bài hát theo album:", error);
        setLoading(false);
      }
    };
    fetchSongs();
  }, [selectedAlbum]);

  const handleAlbumChange = (albumId) => {
    setSelectedAlbum(albumId);
  };

  return { albums, selectedAlbum, handleAlbumChange, songs, loading };
};