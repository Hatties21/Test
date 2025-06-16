import React, { useState } from 'react';
import { 
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  Facebook,
  Google
} from '@mui/icons-material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý login logic ở đây
    console.log('Login submitted:', { email, password });
    
    // Sau khi login thành công, chuyển hướng về trang chủ
    // navigate('/');
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        {/* Logo và tiêu đề */}
        <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
          Đăng nhập
        </Typography>

        {/* Form đăng nhập */}
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
          type={showPassword ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />

        {/* Nút đăng nhập */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            py: 1.5,
            fontSize: '1rem',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark'
            }
          }}
        >
          Đăng nhập
        </Button>

        {/* Quên mật khẩu */}
        <Box sx={{ alignSelf: 'flex-end', mb: 2 }}>
          <Link href="/forgot-password" variant="body2">
            Quên mật khẩu?
          </Link>
        </Box>

        <Divider sx={{ width: '100%', my: 2 }}>Hoặc</Divider>

        {/* Đăng nhập bằng mạng xã hội */}
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <IconButton
            aria-label="Login with Facebook"
            sx={{ 
              bgcolor: '#1877F2',
              color: 'white',
              '&:hover': { bgcolor: '#166FE5' }
            }}
          >
            <Facebook />
          </IconButton>
          
          <IconButton
            aria-label="Login with Google"
            sx={{ 
              bgcolor: '#DB4437',
              color: 'white',
              '&:hover': { bgcolor: '#C1351A' }
            }}
          >
            <Google />
          </IconButton>
        </Box>

        {/* Đăng ký tài khoản */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2">
            Chưa có tài khoản?{' '}
            <Link href="/register" sx={{ fontWeight: 'bold' }}>
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;