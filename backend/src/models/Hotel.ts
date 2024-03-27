import mongoose, { Document, Schema } from 'mongoose';

interface IHotel extends Document {
  name: string;
  location: string;
  rooms: number;
  pricePerNight: number;
  amenities: string[];
}

const HotelSchema: Schema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rooms: { type: Number, required: true },
  pricePerNight: Number,
  amenities: [String], // An array of strings
});

export default mongoose.model<IHotel>('Hotel', HotelSchema);
