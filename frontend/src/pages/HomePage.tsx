import React from 'react';
import { Box } from '@mui/material';
import SearchBar from '../components/SearchBar';

const HomePage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pt: 2, width: '100%' }}>
      <SearchBar />
    </Box>
  );
}

export default HomePage;
