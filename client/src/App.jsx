import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/layout/Navbar';
import PlayerBar from './components/player/PlayerBar';
import Home from './pages/Home';
import Library from './pages/Library';
import Album from './pages/Album';

// Tạo theme Material-UI
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    background: { default: '#f5f5f5' }
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }
});

// Component để kiểm soát hiển thị PlayerBar
const AppContent = () => {
  const location = useLocation();
  const hidePlayerBar = location.pathname === '/login';

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/library" element={<Library />} />
        <Route path="/album" element={<Album />} />
      </Routes>
      {!hidePlayerBar && <PlayerBar />}
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;