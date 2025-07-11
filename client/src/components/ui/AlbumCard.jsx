import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

const AlbumCard = ({ album, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      width: 240,
      cursor: onClick ? 'pointer' : 'default',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      overflow: 'hidden',
      boxShadow: 3,
      '&:hover': { boxShadow: 6 },
    }}
  >
    {album.coverUrl && (
      <CardMedia
        component="img"
        height="140"
        image={album.coverUrl}
        alt={album.title}
      />
    )}
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6" noWrap gutterBottom>
        {album.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {album.artist}
      </Typography>
    </CardContent>
    <Box p={1}>
      <Typography variant="caption" color="text.secondary">
        {album.songs.length} bài hát
      </Typography>
    </Box>
  </Card>
);

export default AlbumCard;
