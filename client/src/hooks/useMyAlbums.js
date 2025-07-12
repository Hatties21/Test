import { useState, useEffect } from 'react';
import { fetchMyAlbums } from '../services/albumService';

export default function useMyAlbums() {
  const [albums, setAlbums]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchMyAlbums();
      setAlbums(data);
      setError(null);
    } catch (err) {
      console.error('❌ Lỗi khi load my-albums:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { albums, loading, error, reload: load };
}
