import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import api from '../api/api';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  bookings: Booking[];
}

interface Booking {
    _id: string;
    flightNumber: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
  
    if (token && userId) {
      api.get(`/user/${userId}`)
        .then(res => setUser(res.data))
        .catch(err => console.error(err));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  const handleDeleteAccount = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.delete(`/user/${userId}`)
        .then(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          window.location.href = '/';
        })
        .catch(err => console.error(err));
    }
  };

  if (!user) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
      <Typography variant="h4">Profile</Typography>
      <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
      <Typography>{user.email}</Typography>
      
      <Typography variant="h6">Bookings</Typography>
      {user.bookings.length > 0 ? (
        user.bookings.map(booking => (
          <Typography key={booking._id}>{booking.flightNumber}</Typography>
        ))
      ) : (
        <Typography>No flights booked</Typography>
      )}

      <Button variant="contained" color="secondary" onClick={handleSignOut} sx={{ mt: 2 }}>
        Sign Out
      </Button>
      <Button variant="contained" color="secondary" onClick={handleDeleteAccount} sx={{ mt: 5 }}>
        Delete Account
      </Button>
    </Box>
  );
};

export default ProfilePage;
