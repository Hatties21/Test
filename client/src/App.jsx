import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/layout/Navbar";
import PlayerBar from "./components/player/PlayerBar";
import Home from "./pages/Home";
import Album from "./pages/Album";
import Profile from "./pages/Profile";
import SongDetail from "./pages/SongDetail";
import Explore from "./pages/Explore";
import Top from "./pages/Top"; // Import Top page

// ✅ Tạo theme Material-UI
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    background: { default: "#f5f5f5" },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
});

// ✅ Tách AppContent để dùng useLocation
const AppContent = () => {
  const location = useLocation();
  const hidePlayerBar =
    location.pathname === "/login" || location.pathname === "/register";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const [songs, setSongs] = useState([]); // toàn bộ danh sách bài hát
  const [currentIndex, setCurrentIndex] = useState(null); // vị trí hiện tại
  const [currentSong, setCurrentSong] = useState(null); // bài hát đang phát

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
        setCurrentSong={setCurrentSong}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              setCurrentSong={setCurrentSong}
              setSongs={setSongs}
              setCurrentIndex={setCurrentIndex}
            />
          }
        />

        {/* Route Khám phá */}
        <Route
          path="/explore"
          element={
            <Explore
              currentSong={currentSong}
              songs={songs}
              currentIndex={currentIndex}
              setCurrentSong={setCurrentSong}
              setSongs={setSongs}
              setCurrentIndex={setCurrentIndex}
            />
          }
        />

        <Route
          path="/top"
          element={
            <Top
              setCurrentSong={setCurrentSong}
              setSongs={setSongs}
              setCurrentIndex={setCurrentIndex}
            />
          }
        />

        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/album"
          element={
            <Album
              setCurrentSong={setCurrentSong}
              setSongs={setSongs}
              setCurrentIndex={setCurrentIndex}
            />
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/song/:id"
          element={
            <SongDetail
              setCurrentSong={setCurrentSong}
              setSongs={setSongs}
              setCurrentIndex={setCurrentIndex}
            />
          }
        />
      </Routes>

      {!hidePlayerBar && (
        <PlayerBar
          currentSong={currentSong}
          songs={songs}
          currentIndex={currentIndex}
          setCurrentSong={setCurrentSong}
          setCurrentIndex={setCurrentIndex}
        />
      )}
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
