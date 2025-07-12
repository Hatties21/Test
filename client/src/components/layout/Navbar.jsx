import React, { useState, useEffect } from 'react';
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
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { songApi } from '../../api';
import { useDebounce } from 'use-debounce';
import logo from '../../assets/images/logo.jpg';

const Navbar = ({ isLoggedIn, user, setIsLoggedIn, setUser, setCurrentSong }) => {
  // State management
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items
  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'ALBUM', path: '/album' },
    { label: "KHÁM PHÁ",  path: "/explore"  },
    { label: 'TOP', path: '/top' },
  ];

  // Custom styled button
  const NavButton = styled(Button)(({ theme, isactive }) => ({
    fontFamily: '"Varela Round", "M PLUS Rounded 1c", sans-serif',
    fontWeight: 700,
    color: 'black',
    textTransform: 'uppercase',
    fontSize: '0.95rem',
    letterSpacing: '0.03em',
    padding: '6px 18px',
    borderRadius: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '6px',
      left: '18px',
      right: '18px',
      height: isactive ? '4px' : '0px',
      backgroundColor: 'currentColor',
      borderRadius: '2px',
      transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      '&::after': {
        height: '4px',
      },
    },
  }));

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setLoading(true);
        const response = await songApi.searchSongs(debouncedSearchQuery);
        setSearchResults(response.data);
      } catch (err) {
        setError('Failed to fetch search results');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery]);

  // Handle song selection
  const handleSongSelect = async (song) => {
    if (!song?._id) return;

    try {
      setLoading(true);
      const { data: fullSong } = await songApi.getSongById(song._id);
      
      setCurrentSong({
        ...fullSong,
        likesCount: fullSong.likedBy?.length || 0
      });

      navigate(`/song/${song._id}`);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      setError('Failed to load song details');
      console.error('Song load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Auth handlers
  const handleLogin = () => navigate('/login');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUser(null);
    setAnchorEl(null);
    navigate('/login');
  };

  // Menu handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={4}
        sx={{
          backgroundColor: 'white',
          color: 'black',
          py: 1,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo Section */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={logo}
              alt="Music App Logo"
              sx={{
                height: 40,
                mr: 1,
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                fontFamily: '"Roboto Condensed", sans-serif',
                color: 'black',
                fontSize: '1.25rem',
              }}
            >
              MusicApp
            </Typography>
          </Link>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 0.4, flexGrow: 1, ml: 5 }}>
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

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '24px',
              px: 2,
              py: 0.5,
              ml: 1,
              mr: 4,
              minWidth: '300px',
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiInputBase-input': { py: 1 },
                '&:hover': { backgroundColor: 'transparent' },
              }}
              InputProps={{
                endAdornment: loading && <CircularProgress size={20} />,
              }}
            />
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '60px',
                  width: '300px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  bgcolor: 'background.paper',
                  boxShadow: 3,
                  borderRadius: 1,
                  zIndex: 1200,
                }}
              >
                {searchResults.map((song) => (
                  <Box
                    key={song._id}
                    onClick={() => handleSongSelect(song)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <img
                      src={song.imageUrl}
                      alt={song.title}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        objectFit: 'cover',
                      }}
                    />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {song.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {song.artist}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* User Section */}
          <Box>
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  alt={user?.name}
                  src={user?.avatar}
                  onClick={handleMenuOpen}
                  sx={{ cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                />
                <Typography
                  variant="body1"
                  onClick={handleMenuOpen}
                  sx={{
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { color: '#666' },
                  }}
                >
                  {user?.name}
                </Typography>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => navigate('/profile')}>
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
                  color: 'black',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  '&:hover': { 
                    color: '#666', 
                    backgroundColor: 'transparent' 
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Error Notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;