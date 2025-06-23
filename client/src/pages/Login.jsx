import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  Facebook,
  Google,
} from "@mui/icons-material";

const Login = ({ setIsLoggedIn, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShow((show) => !show);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Gọi API login
      const { data } = await axios.post(
        "/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      // Lưu token vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          id: data._id,
          name: data.name,
          email: data.email,
        })
      );

      setIsLoggedIn(true);
      setUser({
        id: data._id,
        name: data.name,
        email: data.email,
      });

      alert("Đăng nhập thành công!");
      navigate("/");

      // Chuyển hướng về homepage
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
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
          Đăng nhập
        </Typography>

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Mật khẩu"
          variant="outlined"
          fullWidth
          margin="normal"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
          disabled={loading}
          sx={{
            mt: 3,
            mb: 2,
            py: 1.5,
            fontSize: "1rem",
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </Button>

        <Box sx={{ alignSelf: "flex-end", mb: 2 }}>
          <MuiLink component={RouterLink} to="/forgot-password" variant="body2">
            Quên mật khẩu?
          </MuiLink>
        </Box>

        <Divider sx={{ width: "100%", my: 2 }}>Hoặc</Divider>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <IconButton
            aria-label="Login with Facebook"
            sx={{
              bgcolor: "#1877F2",
              color: "white",
              "&:hover": { bgcolor: "#166FE5" },
            }}
          >
            <Facebook />
          </IconButton>
          <IconButton
            aria-label="Login with Google"
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
            Chưa có tài khoản?{" "}
            <MuiLink
              component={RouterLink}
              to="/register"
              sx={{ fontWeight: "bold" }}
            >
              Đăng ký ngay
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
