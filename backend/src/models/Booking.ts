// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// // Define the Booking model
// const bookingSchema = new Schema({
//     userId: { 
//       type: Schema.Types.ObjectId, 
//       ref: 'User' // A reference to the User model
//     }, 
//     flightId: {
//        type: Schema.Types.ObjectId, 
//        ref: 'Flight' // A reference to the Flight model
//     }, 
//     hotelId: { 
//       type: Schema.Types.ObjectId, 
//       ref: 'Hotel' // A reference to the Hotel model
//     }, 
//     bookingDate: {
//       type: Date,
//       default: Date.now
//     },
//     totalPrice: Number,
//   });
//   const Booking = mongoose.model('Booking', bookingSchema);


//   module.exports = Booking;
