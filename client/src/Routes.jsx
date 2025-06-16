import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Library from './pages/Library';
import Login from './pages/Login';

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library" element={<Library />} />
      <Route path="/login" element={<Login />} />
      <Route path="/album" element={<Album />} />

    </Routes>
  );
};

export default MainRoutes;