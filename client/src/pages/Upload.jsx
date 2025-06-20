// client/src/pages/Upload.jsx
import { useState } from 'react';
import axios from 'axios';

function Upload() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('audio', file);

    try {
      await axios.post('/api/songs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Upload thành công!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Tên bài hát" onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Ca sĩ" onChange={(e) => setArtist(e.target.value)} />
      <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
    </form>
  );
}