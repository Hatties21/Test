// src/components/SongListDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, List, ListItem, ListItemText,
  CircularProgress, Box
} from '@mui/material';
import songApi from '../../api/songApi';

const SongListDialog = ({ open, onClose, onSelect }) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    songApi.getSongs(1, 1000)
      .then(res => setSongs(res.data.songs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Chọn bài hát</DialogTitle>
      <Box p={2}>
        {loading
          ? <CircularProgress />
          : (
            <List>
              {songs.map(song => (
                <ListItem
                  key={song._id}
                  button
                  onClick={() => { onSelect(song._id); onClose(); }}
                >
                  <ListItemText
                    primary={song.title}
                    secondary={song.artist}
                  />
                </ListItem>
              ))}
            </List>
          )}
      </Box>
    </Dialog>
  );
};

export default SongListDialog;
