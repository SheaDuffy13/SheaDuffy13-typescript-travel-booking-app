import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box mt={5} py={3} style={{ backgroundColor: '#f5f5f5' }}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Typography variant="h6">Site quick links</Typography>
            <Link href="https://example.com/link1" target="_blank" rel="noopener noreferrer">Link 1</Link>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="h6">Company</Typography>
            <Link href="https://example.com/link2" target="_blank" rel="noopener noreferrer">Link 2</Link>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="h6">Extras</Typography>
            <Link href="https://example.com/link3" target="_blank" rel="noopener noreferrer">Link 3</Link>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="h6">Help & support</Typography>
            <Link href="https://example.com/link4" target="_blank" rel="noopener noreferrer">Link 4</Link>
          </Grid>
        </Grid>
        <Typography variant="body1" align="center" style={{ marginTop: '1rem' }}>Your Website © 2024</Typography>
        {/* <Typography variant="body1">
          +1 (123) 456-7890
        </Typography> */}
      </Container>
    </Box>
  );
}

export default Footer;
