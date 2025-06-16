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
} from "@mui/material";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.jpg";
import SearchIcon from "@mui/icons-material/Search"; // Thêm import icon kính lúp

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const user = {
    name: "John Doe",
    avatar: "/path-to-default-avatar.jpg",
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const roundedFont = {
    fontFamily: '"Varela Round", "M PLUS Rounded 1c", sans-serif',
    fontWeight: 700, // Tăng từ 500 lên 700 để đậm hơn
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
    fontSize: "0.95rem", // Tăng kích thước chữ
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
        {/* Phần logo bên trái */}
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
              "&:hover": {
                transform: "scale(1.1)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 800, // Tăng độ đậm lên 800
              fontFamily: '"Roboto Condensed", sans-serif',
              color: "black",
              fontSize: "1.25rem", // Tăng kích thước chữ
            }}
          >
            Dead
          </Typography>
        </Link>

        {/* Các tab điều hướng */}
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

        {/* Thanh tìm kiếm ở giữa */}
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
            flexGrow: 0.4,
          }}
        >
          <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
          <InputBase
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              color: "inherit",
              width: "100%",
              "& .MuiInputBase-input": {
                py: 1,
                width: "100%",
                // Loại bỏ transition và thay đổi width khi focus
              },
              // Loại bỏ outline khi focus
              "&.Mui-focused": {
                outline: "none",
                boxShadow: "none",
              },
              // Loại bỏ hiệu ứng hover
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          />
        </Box>

        {/* Phần login/avatar bên phải */}
        <Box>
          {isLoggedIn ? (
            <>
              <Avatar
                alt={user.name}
                src={user.avatar}
                onClick={handleMenuOpen}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              />
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
            </>
          ) : (
            <Button
              color="inherit"
              onClick={handleLogin}
              sx={{
                color: "black",
                textTransform: "none",
                fontWeight: 700, // Tăng độ đậm
                fontSize: "0.95rem", // Tăng kích thước chữ
                "&:hover": {
                  color: "#666",
                  backgroundColor: "transparent",
                },
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
