import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Fight Center
        </Typography>
        <Typography variant="body1">
          +1 (123) 456-7890
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
