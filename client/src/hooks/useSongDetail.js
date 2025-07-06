import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

const useSongDetail = (setCurrentSong) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [song, setSong] = useState(null);
  const [randomSongs, setRandomSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy chi tiết bài hát
        const { data: songDetail } = await apiClient.get(`/songs/${id}`);
        setSong(songDetail);

        // Lấy tất cả để gợi ý
        const { data: allData } = await apiClient.get("/songs");
        const list = allData.songs || allData;
        const others = list.filter((s) => s._id !== id);
        setRandomSongs(others.sort(() => Math.random() - 0.5).slice(0, 3));
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu bài hát:", err);
        setSong(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleRandomClick = (s) => {
    if (setCurrentSong) setCurrentSong(s);
    navigate(`/song/${s._id}`);
  };


  return { song, randomSongs, loading, handleRandomClick };
};

export default useSongDetail;
