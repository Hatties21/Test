import React from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const AddAlbumButton = ({ onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      width: 48,
      height: 48,
      ml: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed',
      borderColor: 'grey.400',
      borderRadius: 1,
      cursor: 'pointer',
      '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
    }}
  >
    <AddIcon fontSize="large" />
  </Box>
);

export default AddAlbumButton;
