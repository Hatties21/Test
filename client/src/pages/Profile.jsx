// src/pages/Profile.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

import useUserSongs from '../hooks/useUserSongs';
import songApi from '../api/songApi';
import userApi from '../api/userApi';

const Profile = () => {
  const navigate = useNavigate();
  // Load user info from localStorage
  const storedUser = JSON.parse(localStorage.getItem('userInfo')) || {};
  const [userInfo, setUserInfo] = useState(storedUser);

  // Hook tải bài hát của user
  const { songs, setSongs, loading, error } = useUserSongs();

  // States cho modal chỉnh sửa
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name:  userInfo.name || '',
    email: userInfo.email || '',
  });
  const [saving, setSaving] = useState(false);

  // Toggle modal
  const toggleEdit = () => {
    setForm({ name: userInfo.name, email: userInfo.email });
    setEditOpen(o => !o);
  };

  // Handle form change
  const handleFormChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  // Save updated user
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await userApi.updateUser(form);
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setEditOpen(false);
    } catch (err) {
      console.error('Lỗi cập nhật user:', err);
      alert(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  // Delete account
  const handleDeleteUser = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa tài khoản?')) return;
    try {
      await userApi.deleteUser();
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      navigate('/login');
    } catch (err) {
      console.error('Lỗi xóa tài khoản:', err);
      alert(err.response?.data?.message || 'Xóa thất bại');
    }
  };

  // Delete a song
  const handleDeleteSong = async id => {
    if (!window.confirm('Xóa bài hát này?')) return;
    try {
      await songApi.deleteSong(id);
      setSongs(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('Lỗi xóa bài hát:', err);
      alert('Xóa bài hát thất bại');
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
        <Typography variant="body1" gutterBottom>
          <strong>Tên:</strong> {userInfo.name || 'Chưa có'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Email:</strong> {userInfo.email || 'Chưa có'}
        </Typography>

        <Box mt={3} display="flex" flexDirection="column" gap={2}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={toggleEdit}
          >
            Chỉnh sửa thông tin
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteUser}
          >
            Xóa tài khoản
          </Button>
        </Box>
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
            <IconButton
              edge="end"
              color="error"
              onClick={() => handleDeleteSong(song._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
      </Box>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onClose={toggleEdit}>
        <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} width={300}>
            <TextField
              label="Tên"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleFormChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleEdit} disabled={saving}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            startIcon={saving && <CircularProgress size={16} />}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
