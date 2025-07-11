import { useState, useEffect } from 'react';
import songApi from '../api/songApi';
import { groupSongsByUploader } from '../services/songGroupingService';

/**
 * Hook lấy tất cả songs rồi nhóm thành “album” theo uploader (username)
 */
const useUploaderAlbums = (page = 1, limit = 1000) => {
  const [albums, setAlbums]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await songApi.getSongs(page, limit);
      // getSongs trả về { songs, currentPage, totalPages }
      const allSongs = res.data.songs;
      const grouped  = groupSongsByUploader(allSongs);
      setAlbums(grouped);
      setError(null);
    } catch (err) {
      console.error('❌ Lỗi khi load songs để tạo uploader-albums:', err);
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

export default useUploaderAlbums;
