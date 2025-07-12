import React from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Box
} from "@mui/material";

/**
 * Dialog hiển thị danh sách bài trong album,
 * click vào 1 item sẽ gọi onSelect(songId) rồi đóng dialog.
 */
const SongRemoveDialog = ({ open, onClose, songs, onSelect }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Xóa bài hát khỏi album</DialogTitle>
    <Box p={2}>
      <List>
        {songs.map(song => (
          <ListItem
            key={song._id}
            button
            onClick={() => {
              onSelect(song._id);
              onClose();
            }}
          >
            <ListItemText
              primary={song.title}
              secondary={song.artist || song.username}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  </Dialog>
);

export default SongRemoveDialog;
