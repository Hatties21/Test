// src/pages/Album.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import useArtistAlbums from "../hooks/useArtistAlbums";
import useUploaderAlbums from "../hooks/useUploaderAlbums";
import useMyAlbums from "../hooks/useMyAlbums";

import ArtistAlbumSection from "../components/ui/ArtistAlbumSection";
import UploaderAlbumSection from "../components/ui/UploaderAlbumSection";
import SongCard from "../components/ui/SongCard";
import AlbumOption from "../components/ui/AlbumOption";
import SongListDialog from "../components/ui/SongListDialog";
import SongRemoveDialog from "../components/ui/SongRemoveDialog";

import {
  createAlbum    as createAlbumApi,
  updateAlbum,
  deleteAlbum,
  addSongToAlbum,
  removeSongFromAlbum
} from "../services/albumService";

const Album = ({ setCurrentSong, setSongs, setCurrentIndex }) => {
  // Tab hiện tại
  const [tab, setTab] = useState("artist");

  // Load data
  const { albums: artistAlbums, loading: la, error: ea } = useArtistAlbums();
  const { albums: uploaderAlbums, loading: lu, error: eu } = useUploaderAlbums();
  const { albums: custom, loading: lc, error: ec, reload } = useMyAlbums();

  // Dialog tạo album
  const [openCreate, setOpenCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState("");

  // Dialog chọn bài hát để thêm
  const [songDialogOpen, setSongDialogOpen] = useState(false);
  const [songDialogIdx, setSongDialogIdx] = useState(null);

  // Dialog chọn bài hát để xóa
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [removeDialogIdx, setRemoveDialogIdx]   = useState(null);

  // Chuyển tab
  const handleChange = (_, value) => {
    if (value === "add") {
      setTitle("");
      setErrorTitle("");
      setOpenCreate(true);
    } else {
      setTab(value);
    }
  };

  // Tạo album mới
  const handleCreate = async () => {
    if (!title.trim()) {
      setErrorTitle("Vui lòng nhập tên album");
      return;
    }
    try {
      await createAlbumApi({ title: title.trim() });
      await reload();
      const idx = custom.length;
      setOpenCreate(false);
      setTab(`custom-${idx}`);
    } catch (err) {
      console.error("❌ Lỗi khi tạo album:", err);
      setErrorTitle("Không thể tạo album, thử lại sau");
    }
  };

  // Cập nhật tên album
  const handleUpdateAlbum = async (idx) => {
    const alb = custom[idx];
    const newTitle = window.prompt("Nhập tên album mới:", alb.title);
    if (!newTitle || newTitle.trim() === alb.title) return;
    try {
      await updateAlbum(alb._id, { title: newTitle.trim() });
      await reload();
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật album:", err);
    }
  };

  // Xóa album
  const handleDeleteAlbum = async (idx) => {
    const alb = custom[idx];
    if (!window.confirm(`Xác nhận xóa album "${alb.title}"?`)) return;
    try {
      await deleteAlbum(alb._id);
      await reload();
      setTab("artist");
    } catch (err) {
      console.error("❌ Lỗi khi xóa album:", err);
    }
  };

  // Mở dialog chọn thêm bài
  const handleOpenSongPicker = (idx) => {
    setSongDialogIdx(idx);
    setSongDialogOpen(true);
  };

  // Xử lý thêm bài
  const handleAddSong = async (songId) => {
    const alb = custom[songDialogIdx];
    try {
      await addSongToAlbum(alb._id, songId);
      await reload();
    } catch (err) {
      console.error("❌ Lỗi khi thêm bài vào album:", err);
    }
  };

  // Mở dialog chọn xóa bài
  const handleOpenRemoveDialog = (idx) => {
    setRemoveDialogIdx(idx);
    setRemoveDialogOpen(true);
  };

  // Xử lý xóa bài
  const handleRemoveSong = async (songId) => {
    const alb = custom[removeDialogIdx];
    try {
      await removeSongFromAlbum(alb._id, songId);
      await reload();
    } catch (err) {
      console.error("❌ Lỗi khi xóa bài khỏi album:", err);
    }
  };

  // Chọn component hiển thị theo tab
  let content = null;
  if (tab === "artist") {
    if (la) content = <Typography>Đang tải theo tác giả…</Typography>;
    else if (ea) content = <Typography color="error">Lỗi khi tải</Typography>;
    else
      content = artistAlbums.map((g) => (
        <ArtistAlbumSection
          key={g.artist}
          artist={g.artist}
          songs={g.songs}
          setCurrentSong={setCurrentSong}
          setSongs={setSongs}
          setCurrentIndex={setCurrentIndex}
        />
      ));
  } else if (tab === "uploader") {
    if (lu) content = <Typography>Đang tải theo người đăng tải…</Typography>;
    else if (eu) content = <Typography color="error">Lỗi khi tải</Typography>;
    else
      content = uploaderAlbums.map((g) => (
        <UploaderAlbumSection
          key={g.uploader}
          uploader={g.uploader}
          songs={g.songs}
          setCurrentSong={setCurrentSong}
          setSongs={setSongs}
          setCurrentIndex={setCurrentIndex}
        />
      ));
  } else if (tab.startsWith("custom-")) {
    const idx = parseInt(tab.split("-")[1], 10);
    const alb = custom[idx] || { songs: [] };

    content = (
      <Box mb={4}>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h5" flexGrow={1}>
            <strong>{alb.title}</strong>
          </Typography>
          <AlbumOption
            onEdit={() => handleUpdateAlbum(idx)}
            onDelete={() => handleDeleteAlbum(idx)}
            onAddSong={() => handleOpenSongPicker(idx)}
            onRemoveSong={() => handleOpenRemoveDialog(idx)}
          />
        </Box>

        {alb.songs.length > 0 ? (
          <Box display="flex" flexWrap="wrap" gap={2}>
            {alb.songs.map((song, i) => (
              <SongCard
                key={song._id}
                song={song}
                onClick={() => {
                  setSongs(alb.songs);
                  setCurrentIndex(i);
                  setCurrentSong(song);
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">
            Chưa có bài nào trong album này.
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Danh sách Album
      </Typography>

      <Tabs value={tab} onChange={handleChange} sx={{ mb: 3 }}>
        <Tab label="Tác giả" value="artist" />
        <Tab label="Người đăng tải" value="uploader" />
        {custom.map((alb, i) => (
          <Tab key={alb._id} label={alb.title} value={`custom-${i}`} />
        ))}
        <Tab icon={<AddIcon />} value="add" />
      </Tabs>

      {content}

      {/* Dialog tạo album mới */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Tạo album mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên album"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={Boolean(errorTitle)}
            helperText={errorTitle}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreate}>
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog chọn bài hát để thêm */}
      <SongListDialog
        open={songDialogOpen}
        onClose={() => setSongDialogOpen(false)}
        onSelect={handleAddSong}
      />

      {/* Dialog chọn bài hát để xóa */}
      <SongRemoveDialog
        open={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
        songs={custom[removeDialogIdx]?.songs || []}
        onSelect={handleRemoveSong}
      />
    </Box>
  );
};

export default Album;
