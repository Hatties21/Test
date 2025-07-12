// src/components/AlbumOption.jsx
import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const AlbumOption = ({ onEdit, onDelete, onAddSong, onRemoveSong }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit?.();
          }}
        >
          Cập nhật album
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onDelete?.();
          }}
        >
          Xóa album
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onAddSong?.();
          }}
        >
          Thêm bài hát vào album
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onRemoveSong?.();
          }}
        >
          Xóa bài hát khỏi album
        </MenuItem>
      </Menu>
    </>
  );
};

export default AlbumOption;
