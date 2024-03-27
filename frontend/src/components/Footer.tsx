import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box mt={5} py={3} style={{ backgroundColor: '#f5f5f5' }}>
      <Container>
        <Typography variant="body1">Your Website © 2024</Typography>
      </Container>
    </Box>
  );
}

export default Footer;
