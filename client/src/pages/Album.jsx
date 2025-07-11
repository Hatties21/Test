import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";

import useArtistAlbums from "../hooks/useArtistAlbums";
import useUploaderAlbums from "../hooks/useUploaderAlbums";
import ArtistAlbumSection from "../components/ui/ArtistAlbumSection";
import UploaderAlbumSection from "../components/ui/UploaderAlbumSection";

const Album = ({ setCurrentSong, setSongs, setCurrentIndex }) => {
  const [groupBy, setGroupBy] = useState("artist"); // 'artist' hoặc 'uploader'

  const {
    albums: artistAlbums,
    loading: loadingArtist,
    error: errorArtist,
  } = useArtistAlbums();
  const {
    albums: uploaderAlbums,
    loading: loadingUploader,
    error: errorUploader,
  } = useUploaderAlbums();

  const albums = groupBy === "artist" ? artistAlbums : uploaderAlbums;
  const loading = groupBy === "artist" ? loadingArtist : loadingUploader;
  const error = groupBy === "artist" ? errorArtist : errorUploader;

  const handleTabChange = (_, newValue) => {
    setGroupBy(newValue);
  };

  if (loading) return <Typography>Đang tải album…</Typography>;
  if (error) return <Typography>Lỗi khi tải album.</Typography>;

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Danh sách Album
      </Typography>

      <Tabs value={groupBy} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Tác giả" value="artist" />
        <Tab label="Người đăng tải" value="uploader" />
      </Tabs>

      {albums.length === 0 ? (
        <Typography>Chưa có bài hát nào để tạo album.</Typography>
      ) : (
        albums.map((group) =>
          groupBy === "artist" ? (
            <ArtistAlbumSection
              key={group.artist}
              artist={group.artist}
              songs={group.songs}
              setCurrentSong={setCurrentSong}
              setSongs={setSongs}               // ← Truyền playlist lên
              setCurrentIndex={setCurrentIndex} // ← Truyền index hiện tại
            />
          ) : (
            <UploaderAlbumSection
              key={group.uploader}
              uploader={group.uploader}
              songs={group.songs}
              setCurrentSong={setCurrentSong}
              setSongs={setSongs}
              setCurrentIndex={setCurrentIndex}
            />
          )
        )
      )}
    </Box>
  );
};

export default Album;
