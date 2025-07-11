import { useState, useEffect } from 'react';
import songApi from '../api/songApi';

/**
 * Hook lấy danh sách bài hát do user hiện tại upload
 */
const useUserSongs = () => {
  const [songs, setSongs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const user = JSON.parse(localStorage.getItem('userInfo'))?.name;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await songApi.getSongs(1, 1000);
        // Lọc ra chỉ những song mà username === user
        const mySongs = (res.data.songs || []).filter(
          song => song.username === user
        );
        setSongs(mySongs);
      } catch (err) {
        console.error('Lỗi khi load user songs:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  return { songs, setSongs, loading, error };
};

export default useUserSongs;
