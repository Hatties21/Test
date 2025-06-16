import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const HeroSection = styled(Box)({
  minHeight: '60vh',
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: '0 0 20px 20px',
  marginBottom: '2rem'
});

const Home = () => {
  return (
    <Container maxWidth="xl" disableGutters>
      <HeroSection>
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#333'
            }}
          >
            💀
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Dead
          </Typography>
        </Container>
      </HeroSection>
    </Container>
  );
};

export default Home;