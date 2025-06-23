import React from 'react';
import { Box, Typography } from '@mui/material';

const SongCard = ({ song, onClick }) => {
  return (
    <Box sx={{ textAlign: 'center', cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <Box
        component="img"
        src={song.image}
        alt={song.title}
        sx={{
          width: 180,
          height: 180,
          borderRadius: 2,
          objectFit: 'cover',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          marginBottom: 1,
        }}
      />
      <Typography variant="body2" sx={{ fontSize: '14px', wordBreak: 'break-word' }}>
        {song.title}
      </Typography>
    </Box>
  );
};

export default SongCard;
