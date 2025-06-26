import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Facebook,
  Google,
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // File: client/src/pages/Register.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });
    alert("Đăng ký thành công!");
    navigate("/login");
  } catch (err) {
    alert(err.response?.data?.error || "Đăng ký thất bại!");
  }
};


  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 3, fontWeight: "bold" }}
        >
          Đăng ký
        </Typography>

        <TextField
          label="Tên người dùng"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
        />

        <TextField
          label="Mật khẩu"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            py: 1.5,
            fontSize: "1rem",
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          Đăng ký
        </Button>

        <Divider sx={{ width: "100%", my: 2 }}>Hoặc</Divider>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <IconButton
            sx={{
              bgcolor: "#1877F2",
              color: "white",
              "&:hover": { bgcolor: "#166FE5" },
            }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: "#DB4437",
              color: "white",
              "&:hover": { bgcolor: "#C1351A" },
            }}
          >
            <Google />
          </IconButton>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2">
            Đã có tài khoản?{" "}
            <Link href="/login" sx={{ fontWeight: "bold" }}>
              Đăng nhập
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
