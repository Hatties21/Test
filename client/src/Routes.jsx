import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Library from './pages/Library';
import Login from './pages/Login';
import Album from './pages/Album';
import Register from './pages/Register';
import SongDetail from './pages/SongDetail';

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library" element={<Library />} />
      <Route path="/login" element={<Login />} />
      <Route path="/album" element={<Album />} />
      <Route path="/register" element={<Register />} />
      <Route path="/song/:id" element={<SongDetail />} />
      {/* Thêm các route khác nếu cần */}

    </Routes>
  );
};

export default MainRoutes;