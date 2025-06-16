import React from 'react';
import { 
  ThemeProvider,
  createTheme,
  CssBaseline 
} from '@mui/material';
import { 
  BrowserRouter as Router,
  Routes,
  Route 
} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Library from './pages/Library';
import Album from './pages/Album';
import PlayerBar from './components/player/PlayerBar';

// Tạo theme Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Màu chính
    },
    background: {
      default: '#f5f5f5' // Màu nền mặc định
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reset CSS và áp dụng theme */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/library" element={<Library />} />
          <Route path="/album" element={<Album />} />
        </Routes>
        <PlayerBar />
      </Router>
    </ThemeProvider>
  );
}

export default App;