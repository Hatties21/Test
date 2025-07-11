import { useState, useEffect } from 'react';
import { fetchAlbums } from '../services/albumService';

const useAlbums = (page = 1, limit = 25) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAlbums(page, limit);
      setAlbums(data);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi fetch albums:', err);
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

export default useAlbums;
