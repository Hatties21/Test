import { useState, useEffect } from 'react';
import { fetchAlbum } from '../services/albumService';

const useAlbum = (id) => {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAlbum(id);
      setAlbum(data);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi fetch album:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) load();
  }, [id]);

  return { album, loading, error, reload: load };
};

export default useAlbum;
