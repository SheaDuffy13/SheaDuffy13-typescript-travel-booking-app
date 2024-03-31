import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    bookings: Schema.Types.ObjectId[];
    role: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
    role: { type: String, default: "user" },
});

export const User = mongoose.model<IUser>("User", UserSchema);
