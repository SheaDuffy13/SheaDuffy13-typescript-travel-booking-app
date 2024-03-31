import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import headerIcon from '../headerIcon.png';
import { jwtDecode } from 'jwt-decode';


const Header: React.FC = () => {
  const token = localStorage.getItem('token');
  let isExpired = true;

  // Check if the token is expired
  if (token) {
    const decodedToken: any = jwtDecode(token);
    const expirationDate = decodedToken.exp * 1000; // Convert to milliseconds
    isExpired = Date.now() > expirationDate;
  }

  const isLoggedIn = Boolean(token) && !isExpired;

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
