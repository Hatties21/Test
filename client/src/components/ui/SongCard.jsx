import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

const SongCard = ({ song, onClick }) => {
  
  return (
    <Card
      onClick={onClick}
      sx={{
        width: 200,
        height: 230, // Tổng height
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        position: "relative",
        "&:hover": { boxShadow: 6 },
      }}
    >
      {/* Blurred Background */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${song.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(0.1px)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      {/* Phần ảnh chính - CỐ ĐỊNH 70% */}
      <Box
        sx={{
          width: "100%",
          height: "60%", // Luôn giữ 70%
          minHeight: "60%", // Chống trường hợp content đẩy
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          overflow: "hidden", // Ẩn phần ảnh thừa
        }}
      >
        <CardMedia
          component="img"
          image={song.imageUrl}
          alt={song.title}
          sx={{
            width: "auto", // Bỏ maxWidth cũ
            height: "auto", // Bỏ maxHeight cũ
            maxWidth: "100%", // Giới hạn bằng khung cha
            maxHeight: "100%", // Giới hạn bằng khung cha
            objectFit: "contain", // Hiển thị toàn bộ ảnh
            objectPosition: "center", // Canh giữa
          }}
        />
      </Box>

      {/* Phần nội dung (30%) */}
      <CardContent
        sx={{
          flex: "0 0 30%", // Cố định 30%
          p: 2,
          position: "relative",
          zIndex: 1,
          bgcolor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(4px)",
        }}
      >
        <Typography
          variant="subtitle1"
          noWrap
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {song.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {song.artist}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SongCard;