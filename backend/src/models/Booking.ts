import mongoose, { Document, Schema } from 'mongoose';

interface IBooking extends Document {
    user: Schema.Types.ObjectId;
    flight: Schema.Types.ObjectId;
    adults: number;
    children: number;
    cabinClass: string;
    date: Date;
  }
  
  const BookingSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    flight: { type: Schema.Types.ObjectId, ref: 'Flight', required: true },
    adults: { type: Number, required: true },
    children: { type: Number, required: true },
    cabinClass: { type: String, required: true },
    date: { type: Date, default: Date.now }
  });
  
  export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
  