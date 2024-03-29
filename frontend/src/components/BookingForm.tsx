import React, { useState } from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import api from '../api/api';

const BookingForm: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState({
    flightNumber: '',
    passengers: [],
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prevState => ({ ...prevState, [name]: value }));
  };

  const handleApply = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    api.post('/bookings', bookingDetails)
      .then(() => {
        console.log('Booking created successfully!');
      })
      .catch(error => {
        console.error('Error creating booking:', error);
      });
  };

  return (
    <Box>
      <input
        type="text"
        name="flightNumber"
        value={bookingDetails.flightNumber}
        onChange={handleInputChange}
        placeholder="Flight Number"
      />

      <Button variant="contained" color="primary" onClick={handleApply}>
        Apply
      </Button>

      <Modal open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <Box>
          <Typography>Confirm your booking:</Typography>
          <Typography>Flight Number: {bookingDetails.flightNumber}</Typography>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default BookingForm;
