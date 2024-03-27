import mongoose, { Document, Schema } from 'mongoose';

// Define the Flight model
interface IFlight extends Document {
    airline: String;
    departureAirport: String;
    arrivalAirport: String;
    departureTime: Date;
    arrivalTime: Date;
    price: Number;
  };

const FlightSchema = new Schema({
    airline: { type: String, required: true },
      departureAirport: { type: String, required: true },
      arrivalAirport: { type: String, required: true },
      departureTime: { type: Date, required: true },
      arrivalTime: { type: Date, required: true },
      price: { type: Number, required: true },
})

export default mongoose.model<IFlight>('Flight', FlightSchema)