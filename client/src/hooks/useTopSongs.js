import { useState, useEffect } from 'react';
import { fetchTopSongs } from '../services/songService';

const useTopSongs = (limit = 10) => {
  const [songs, setSongs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchTopSongs(limit);
      setSongs(data);
      setError(null);
    } catch (err) {
      console.error('❌ Lỗi khi load top songs:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [limit]);

  return { songs, loading, error, reload: load };
};

export default useTopSongs;
