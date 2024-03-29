import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import headerIcon from '../headerIcon.png'

const Header: React.FC = () => {
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  return (
    <AppBar position="static">
      <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="home" component={Link} to="/">
        <img src={headerIcon} alt="Logo" style={{height: '50px'}} />
      </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body1">
          +1 (123) 456-7890
        </Typography>
        {isLoggedIn ? (
          <Button color="inherit" component={Link} to="/profile">
            Profile
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/signup">
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
