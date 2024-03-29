import mongoose, { Document, Schema } from 'mongoose';

interface IFlight extends Document {
  flightNumber: string;
  departure: Schema.Types.ObjectId;
  destination: Schema.Types.ObjectId;
  date: Date;
  seats: number;
  price: number;
}

const FlightSchema: Schema = new Schema({
  flightNumber: { type: String, required: true, unique: true },
  departure: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  destination: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  date: { type: Date, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true }
});

export const Flight = mongoose.model<IFlight>('Flight', FlightSchema);