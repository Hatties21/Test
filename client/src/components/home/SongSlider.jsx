import React from "react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";

const SubCard = ({ song, direction, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      width: "650px",
      height: "250px",
      opacity: 0.6,
      zIndex: 1,
      transform: direction === "left" ? "translateX(50px)" : "translateX(-50px)",
      cursor: "pointer",
      position: "relative",
      [direction === "left" ? "right" : "left"]: "-50px",
      transition: "all 0.3s ease",
      overflow: "hidden",
      "&:hover": { 
        opacity: 0.8, 
        transform: direction === "left" ? "translateX(60px)" : "translateX(-60px)" 
      },
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
        backgroundImage: `url(${song?.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(4px)",
        zIndex: 0,
      }}
    />
    
    {/* Main Image */}
    <CardMedia
      component="img"
      image={song?.imageUrl}
      alt={song?.title}
      sx={{ 
        position: "relative",
        zIndex: 1,
        height: "100%",
        width: "100%",
        objectFit: "contain",
        objectPosition: "center",
      }}
    />
    
    <CardContent
      sx={{
        position: "absolute",
        bottom: 10,
        left: 10,
        color: "white",
        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
        zIndex: 2,
      }}
    >
      <Typography variant="h5">{song?.title}</Typography>
      <Typography variant="body1">{song?.artist}</Typography>
    </CardContent>
  </Card>
);

const MainCard = ({ song, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      width: "1200px",
      height: "300px",
      zIndex: 2,
      cursor: "pointer",
      margin: "0 -50px",
      position: "relative",
      transition: "all 0.3s ease",
      overflow: "hidden",
      "&:hover": { transform: "scale(1.01)" },
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
        backgroundImage: `url(${song?.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(4px)",
        zIndex: 0,
      }}
    />
    
    {/* Main Image */}
    <CardMedia
      component="img"
      image={song?.imageUrl}
      alt={song?.title}
      sx={{ 
        position: "relative",
        zIndex: 1,
        height: "100%",
        width: "100%",
        objectFit: "contain",
        objectPosition: "center",
      }}
    />
    
    <CardContent
      sx={{
        position: "absolute",
        bottom: 10,
        left: 10,
        color: "white",
        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
        zIndex: 2,
        width: "calc(100% - 20px)",
      }}
    >
      <Typography variant="h5">{song?.title}</Typography>
      <Typography variant="body1">{song?.artist}</Typography>
    </CardContent>
  </Card>
);

const SongSlider = ({ songs, currentIndex, onMainClick, onSubClick }) => {
  const leftIndex = (currentIndex - 1 + songs.length) % songs.length;
  const rightIndex = (currentIndex + 1) % songs.length;

  return (
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
      <SubCard
        song={songs[leftIndex]}
        direction="left"
        onClick={() => onSubClick("left")}
      />
      
      <MainCard 
        song={songs[currentIndex]} 
        onClick={onMainClick} 
      />
      
      <SubCard
        song={songs[rightIndex]}
        direction="right"
        onClick={() => onSubClick("right")}
      />
    </Box>
  );
};

export default SongSlider;