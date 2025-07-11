import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import useUserSongs from '../hooks/useUserSongs';
import songApi from '../api/songApi';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('userInfo')) || {};

  // Sidebar data
  const sidebarItems = [
    { label: 'Tên',  value: user.name  || 'Chưa có' },
    { label: 'Email', value: user.email || 'Chưa có' },
  ];

  // User's songs
  const { songs, setSongs, loading, error } = useUserSongs();

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài hát này không?')) return;
    try {
      await songApi.deleteSong(id);
      setSongs(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa song:', err);
      alert('Xóa không thành công');
    }
  };

  const sidebarWidth = 320;
  const gutter       = 16;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        p: `${gutter}px`,
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
      }}
    >
      {/* Sidebar */}
      <Paper
        elevation={6}
        sx={{
          width: sidebarWidth,
          p: 4,
          borderRadius: 2,
          flexShrink: 0,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Trang cá nhân
        </Typography>
        {sidebarItems.map(item => (
          <Typography key={item.label} variant="body1" gutterBottom>
            <strong>{item.label}:</strong> {item.value}
          </Typography>
        ))}
      </Paper>

      {/* Spacer */}
      <Box sx={{ width: gutter }} />

      {/* Main content: user's songs */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          borderRadius: 2,
          bgcolor: 'white',
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Bài hát của bạn
        </Typography>

        {loading && (
          <Box textAlign="center" mt={2}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error">
            Lỗi khi tải danh sách bài hát.
          </Typography>
        )}

        {!loading && songs.length === 0 && (
          <Typography>Chưa có bài hát nào.</Typography>
        )}

        {songs.map(song => (
          <Box
            key={song._id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            {/* Thumbnail + Title/Artist */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mr: 2 }}>
              <Box
                component="img"
                src={song.imageUrl}
                alt={song.title}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1,
                  objectFit: 'cover',
                  mr: 2,
                }}
              />
              <Typography noWrap>
                {song.title} – {song.artist}
              </Typography>
            </Box>

            {/* Delete button */}
            <IconButton
              edge="end"
              color="error"
              onClick={() => handleDelete(song._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Profile;
