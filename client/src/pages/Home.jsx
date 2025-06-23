import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SongCard from "../components/ui/SongCard"; // hoặc đường dẫn tương ứng

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Tạm thời để sẵn sàng gọi API sau này
  useEffect(() => {
    // fetchSongs(); // Bạn có thể gọi API ở đây sau
  }, []);

  const handleMainCardClick = () => {
    if (songs[currentIndex]) {
      navigate(`/song/${songs[currentIndex].id}`);
    }
  };

  const handleSubCardClick = (direction) => {
    setCurrentIndex((prev) => {
      const total = songs.length;
      if (!total) return prev;
      if (direction === "left") {
        return (prev - 1 + total) % total;
      }
      if (direction === "right") {
        return (prev + 1) % total;
      }
      return prev;
    });
  };

  const leftIndex = (currentIndex - 1 + songs.length) % songs.length;
  const rightIndex = (currentIndex + 1) % songs.length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        width: "100%",
      }}
    >
      {/* Slider Section (ẩn nếu chưa đủ 3 bài) */}
      {songs.length >= 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            width: "100%",
            position: "relative",
            marginBottom: "40px",
          }}
        >
          {/* Sub Left */}
          <Card
            component="div"
            onClick={() => handleSubCardClick("left")}
            sx={{
              width: "800px",
              height: "350px",
              opacity: 0.6,
              zIndex: 1,
              transform: "translateX(50px)",
              cursor: "pointer",
              position: "relative",
              right: "-50px",
              transition: "all 0.3s ease",
              "&:hover": {
                opacity: 0.8,
                transform: "translateX(60px)",
              },
            }}
          >
            <CardMedia
              component="img"
              image={songs[leftIndex]?.image}
              alt={songs[leftIndex]?.title}
              sx={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
            <CardContent
              sx={{
                position: "absolute",
                bottom: 10,
                left: 10,
                color: "white",
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
              }}
            >
              <Typography variant="h5">{songs[leftIndex]?.title}</Typography>
              <Typography variant="body1">
                {songs[leftIndex]?.artist}
              </Typography>
            </CardContent>
          </Card>

          {/* Main Card */}
          <Card
            component="div"
            onClick={handleMainCardClick}
            sx={{
              width: "1800px",
              height: "400px",
              zIndex: 2,
              cursor: "pointer",
              margin: "0 -50px",
              position: "relative",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.01)",
              },
            }}
          >
            <CardMedia
              component="img"
              image={songs[currentIndex]?.image}
              alt={songs[currentIndex]?.title}
              sx={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
            <CardContent
              sx={{
                position: "absolute",
                bottom: 10,
                left: 10,
                color: "white",
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
                width: "calc(100% - 20px)",
              }}
            >
              <Typography variant="h5">{songs[currentIndex]?.title}</Typography>
              <Typography variant="body1">
                {songs[currentIndex]?.artist}
              </Typography>
            </CardContent>
          </Card>

          {/* Sub Right */}
          <Card
            component="div"
            onClick={() => handleSubCardClick("right")}
            sx={{
              width: "800px",
              height: "350px",
              opacity: 0.6,
              zIndex: 1,
              cursor: "pointer",
              transform: "translateX(-50px)",
              position: "relative",
              left: "-50px",
              transition: "all 0.3s ease",
              "&:hover": {
                opacity: 0.8,
                transform: "translateX(-60px)",
              },
            }}
          >
            <CardMedia
              component="img"
              image={songs[rightIndex]?.image}
              alt={songs[rightIndex]?.title}
              sx={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
            <CardContent
              sx={{
                position: "absolute",
                bottom: 10,
                left: 10,
                color: "white",
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
              }}
            >
              <Typography variant="h5">{songs[rightIndex]?.title}</Typography>
              <Typography variant="body1">
                {songs[rightIndex]?.artist}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Danh sách bài hát (chuẩn bị kết nối từ DB) */}
      <Box sx={{ width: "100%", padding: "20px 40px" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: 3,
            textAlign: "center",
            textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
          }}
        >
          Danh sách bài hát
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 180px)",
            gap: 3,
            justifyContent: "center",
          }}
        >
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onClick={() => navigate(`/song/${song.id}`)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
