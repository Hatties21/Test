// File: client/src/components/ui/SongCard.jsx

import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

const SongCard = ({ song, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: 300,
        height: 280,
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        "&:hover": { boxShadow: 6 },
      }}
    >
      {/* Phần ảnh chiếm 70% chiều cao */}
      <Box sx={{ flex: "0 0 70%" }}>
        <CardMedia
          component="img"
          image={song.imageUrl}
          alt={song.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </Box>

      {/* Phần nội dung chiếm 30% chiều cao */}
      <CardContent
        sx={{
          flex: "1 1 30%",
          p: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
          textAlign: "left",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="subtitle1"
          noWrap
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          {song.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
        >
          {song.artist}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SongCard;
