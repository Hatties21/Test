import { useState, useEffect } from 'react';
import songApi from '../api/songApi';
import { groupSongsByArtist } from '../services/songGroupingService';

/**
 * Hook tự động load tất cả songs rồi nhóm thành “album” theo artist
 * getSongs trả về obj { songs, currentPage, totalPages } :contentReference[oaicite:0]{index=0}
 */
const useArtistAlbums = (page = 1, limit = 1000) => {
  const [albums, setAlbums]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await songApi.getSongs(page, limit);
      // LẤY MẢNG SONGS TỪ res.data.songs
      const allSongs = res.data.songs;
      const grouped  = groupSongsByArtist(allSongs);
      setAlbums(grouped);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi load songs để tạo artist-albums:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, limit]);

  return { albums, loading, error, reload: load };
};

export default useArtistAlbums;
