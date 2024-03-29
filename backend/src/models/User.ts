import mongoose, { Document, Schema } from 'mongoose';

// Define the User model
interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  bookings: Schema.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }]
});

export const User = mongoose.model<IUser>('User', UserSchema);