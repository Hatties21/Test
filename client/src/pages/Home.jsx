import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import song1 from '../assets/slider/song1.jpg';
import song2 from '../assets/slider/song2.jpg';
import song3 from '../assets/slider/song3.jpg';

const songs = [
  { id: 1, title: 'Shape of You', artist: 'Ed Sheeran', image: song1 },
  { id: 2, title: 'Blinding Lights', artist: 'The Weeknd', image: song2 },
  { id: 3, title: 'Dance Monkey', artist: 'Tones and I', image: song3 },
  { id: 4, title: 'Someone Like You', artist: 'Adele', image: song2 },
  { id: 5, title: 'Rolling in the Deep', artist: 'Adele', image: song3 },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(goToNext, 5000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(goToNext, 5000);
  };

  const handleMainCardClick = () => {
    navigate(`/song/${songs[currentIndex].id}`);
  };

  const handleSubCardClick = (direction) => {
    setCurrentIndex((prev) => {
      if (direction === 'left') {
        resetTimer();
        return (prev - 1 + songs.length) % songs.length;
      }
      if (direction === 'right') {
        resetTimer();
        return (prev + 1) % songs.length;
      }
      return prev;
    });
  };

  const leftIndex = (currentIndex - 1 + songs.length) % songs.length;
  const rightIndex = (currentIndex + 1) % songs.length;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        width: '100%',
      }}
    >
      {/* Slider Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          width: '100%',
          position: 'relative',
          marginBottom: '40px'
        }}
      >
        {/* Sub Card bên trái */}
        <Card
          component="div"
          onClick={() => handleSubCardClick('left')}
          sx={{
            width: '800px',
            height: '350px',
            textDecoration: 'none',
            color: 'inherit',
            opacity: 0.6,
            zIndex: 1,
            transform: 'translateX(50px)',
            cursor: 'pointer',
            position: 'relative',
            right: '-50px',
            transition: 'all 0.3s ease',
            '&:hover': {
              opacity: 0.8,
              transform: 'translateX(60px)',
            },
          }}
        >
          <CardMedia
            component="img"
            image={songs[leftIndex].image}
            alt={`${songs[leftIndex].title} cover`}
            sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
          <CardContent sx={{ position: 'absolute', bottom: 10, left: 10, color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)' }}>
            <Typography variant="h5">{songs[leftIndex].title}</Typography>
            <Typography variant="body1">{songs[leftIndex].artist}</Typography>
          </CardContent>
        </Card>

        {/* Main Card */}
        <Card
          component="div"
          onClick={handleMainCardClick}
          sx={{
            width: '1800px',
            height: '400px',
            zIndex: 2,
            cursor: 'pointer',
            margin: '0 -50px',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.01)',
            },
          }}
        >
          <CardMedia
            component="img"
            image={songs[currentIndex].image}
            alt={`${songs[currentIndex].title} cover`}
            sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
          <CardContent sx={{ 
            position: 'absolute', 
            bottom: 10, 
            left: 10, 
            color: 'white', 
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
            width: 'calc(100% - 20px)'
          }}>
            <Typography variant="h5">{songs[currentIndex].title}</Typography>
            <Typography variant="body1">{songs[currentIndex].artist}</Typography>
          </CardContent>
        </Card>

        {/* Sub Card bên phải */}
        <Card
          component="div"
          onClick={() => handleSubCardClick('right')}
          sx={{
            width: '800px',
            height: '350px',
            textDecoration: 'none',
            color: 'inherit',
            opacity: 0.6,
            zIndex: 1,
            cursor: 'pointer',
            transform: 'translateX(-50px)',
            position: 'relative',
            left: '-50px',
            transition: 'all 0.3s ease',
            '&:hover': {
              opacity: 0.8,
              transform: 'translateX(-60px)',
            },
          }}
        >
          <CardMedia
            component="img"
            image={songs[rightIndex].image}
            alt={`${songs[rightIndex].title} cover`}
            sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
          <CardContent sx={{ position: 'absolute', bottom: 10, left: 10, color: 'white', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)' }}>
            <Typography variant="h5">{songs[rightIndex].title}</Typography>
            <Typography variant="body1">{songs[rightIndex].artist}</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Header Section */}
      <Box sx={{ 
        width: '100%',
        textAlign: 'center',
        marginTop: '1px',
        padding: '20px 0',
      }}>
        <Typography variant="h3" component="h1" sx={{ 
          fontWeight: 'bold',
          color: 'black', 
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
          marginBottom: '10px'
        }}>
          Discover New Music
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;