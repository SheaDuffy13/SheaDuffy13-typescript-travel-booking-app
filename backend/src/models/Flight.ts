import mongoose from 'mongoose';

// Define the Flight model
const flightSchema = new mongoose.Schema({
  flyingFrom: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  adults: { type: Number, required: true },
  children: { type: Number, default: 0 },
  cabinClass: { type: String, required: true },
});

export default mongoose.model('Flight', flightSchema);
