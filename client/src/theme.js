// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-main)',
    h1: {
      fontFamily: 'var(--font-rounded)',
    },
    // ... các variant khác
  },
});

export default theme;