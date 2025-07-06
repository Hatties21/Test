// ✅ Updated Navbar.jsx with Avatar + Username aligned
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  styled,
  InputBase,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.jpg";
import SearchIcon from "@mui/icons-material/Search";
import { songApi } from "../../api";
import { useDebounce } from "use-debounce";
import { useSongDetail } from "../../hooks";

const Navbar = ({ isLoggedIn, user, setIsLoggedIn, setUser, setCurrentSong}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const {song} = useSongDetail(setCurrentSong);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchQuery.trim()) {
        try {
          const response = await songApi.searchSongs(debouncedSearchQuery);
          setSearchResults(response.data);
        } catch (err) {
          console.error("Lỗi khi tìm kiếm:", err);
        }
      } else {
        setSearchResults([]);
      }
    };
    fetchSearchResults();
  }, [debouncedSearchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSongSelect = (song) => {
    if (!song?._id) return;

    // 1. Cập nhật bài hát hiện tại (nếu cần)
    setCurrentSong(song)

    // 2. Chuyển hướng đến SongDetail
    navigate(`/song/${song._id}`);

    // 3. Reset thanh tìm kiếm
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleLogin = () => navigate("/login");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
    setUser(null);
    setAnchorEl(null);
    navigate("/login");
    window.location.reload();
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const roundedFont = {
    fontFamily: '"Varela Round", "M PLUS Rounded 1c", sans-serif',
    fontWeight: 700,
  };

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "LIBRARY", path: "/library" },
    { label: "ALBUM", path: "/album" },
  ];

  const NavButton = styled(Button)(({ theme, isactive }) => ({
    ...roundedFont,
    color: "black",
    textTransform: "uppercase",
    fontSize: "0.95rem",
    letterSpacing: "0.03em",
    padding: "6px 18px",
    borderRadius: "24px",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "6px",
      left: "18px",
      right: "18px",
      height: isactive ? "4px" : "0px",
      backgroundColor: "currentColor",
      borderRadius: "2px",
      transition: "all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
    },
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      "&::after": {
        height: "4px",
        left: "18px",
        right: "18px",
      },
    },
  }));

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        backgroundColor: "white",
        color: "black",
        py: 1,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Music App Logo"
            sx={{
              height: 40,
              mr: 1,
              borderRadius: "4px",
              cursor: "pointer",
              transition: "transform 0.2s ease-in-out",
              "&:hover": { transform: "scale(1.1)" },
              "&:active": { transform: "scale(0.95)" },
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 800,
              fontFamily: '"Roboto Condensed", sans-serif',
              color: "black",
              fontSize: "1.25rem",
            }}
          >
            Dead
          </Typography>
        </Link>

        <Box sx={{ display: "flex", gap: 0.4, flexGrow: 1, ml: 5 }}>
          {navItems.map((item) => (
            <NavButton
              key={item.path}
              component={Link}
              to={item.path}
              isactive={location.pathname === item.path ? 1 : 0}
            >
              {item.label}
            </NavButton>
          ))}
        </Box>

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            borderRadius: "24px",
            px: 2,
            py: 0.5,
            ml: 1,
            mr: 4,
          }}
        >
          <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
          <Autocomplete
            freeSolo
            options={searchResults}
            getOptionLabel={(option) => `${option.title} - ${option.artist}`}
            onInputChange={(event, newInputValue) =>
              setSearchQuery(newInputValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search..."
                variant="standard"
                sx={{
                  width: "300px",
                  "& .MuiInputBase-input": { py: 1 },
                  "&:hover": { backgroundColor: "transparent" },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                onClick={() => handleSongSelect(option)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  py: 1,
                }}
              >
                <img
                  src={option.imageUrl}
                  alt={option.title}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    objectFit: "cover",
                  }}
                />
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.artist}
                  </Typography>
                </Box>
              </Box>
            )}
            onChange={(event, value) => {
              if (value) {
                navigate(`/songs/${value._id}`);
                setSearchQuery("");
                setSearchResults([]);
              }
            }}
            sx={{
              "& .MuiAutocomplete-listbox": {
                maxHeight: 300,
              },
              "& .MuiAutocomplete-option": {
                px: 2,
                py: 1.5,
              },
            }}
          />
        </Box>

        <Box>
          {isLoggedIn ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                alt={user?.name}
                src={user?.avatar}
                onClick={handleMenuOpen}
                sx={{ cursor: "pointer", "&:hover": { opacity: 0.8 } }}
              />
              <Typography
                variant="body1"
                onClick={handleMenuOpen}
                sx={{
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": { color: "#666" },
                }}
              >
                {user?.name}
              </Typography>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => navigate("/profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              color="inherit"
              onClick={handleLogin}
              sx={{
                color: "black",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                "&:hover": { color: "#666", backgroundColor: "transparent" },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
