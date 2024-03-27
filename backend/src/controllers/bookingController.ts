// const express = require('express');
// const router = express.Router();

// const Booking = require('../models/Booking');

// // GET all bookings
// router.get('/', async (req, res) => {
//     try {
//       const bookings = await Booking.find().populate('user hotel flight');
//       res.json(bookings);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   });
  
  
//   module.exports = router;