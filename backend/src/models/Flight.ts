import mongoose, { Document, Schema } from 'mongoose';

interface IFlight extends Document {
  flightNumber: string;
  departure: Schema.Types.ObjectId;
  destination: Schema.Types.ObjectId;
  date: Date;
  seats: number;
  price: number;
  availableSeats: number;
  bookingCount: number;
  duration: number;
  status: 'active' | 'canceled' | 'delayed';
  passengers: Schema.Types.ObjectId[];
  [key: string]: any;
}

const FlightSchema: Schema = new Schema({
  flightNumber: { type: String, required: true, unique: true },
  departure: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  destination: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  date: { type: Date, required: true },
  seats: { type: Number, required: true },
  bookingCount: { type: Number, default: 0 },
  availableSeats: { type: Number, default: function() { return this.seats; } },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['active', 'canceled', 'delayed'], default: 'active' },
  passengers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export const Flight = mongoose.model<IFlight>('Flight', FlightSchema);
