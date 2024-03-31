import mongoose, { Document, Schema } from "mongoose";

interface IBooking extends Document {
    user: Schema.Types.ObjectId;
    flight: Schema.Types.ObjectId;
    passengers: {
        adults: number;
        children: number;
        total: number;
    };
    cabinClass: string;
    seats: {
        economy: number;
        premiumEconomy: number;
        business: number;
        firstClass: number;
    };
    date: Date;
}

const BookingSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    flight: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
    passengers: {
        adults: { type: Number, required: true },
        children: { type: Number, required: true },
        total: { type: Number },
    },
    cabinClass: { type: String, required: true },
    seats: {
        economy: { type: Number, default: 0 },
        premiumEconomy: { type: Number, default: 0 },
        business: { type: Number, default: 0 },
        firstClass: { type: Number, default: 0 },
    },
    date: { type: Date, default: Date.now },
});

BookingSchema.pre<IBooking>("save", function (next) {
    // Calculate totalPassengers
    this.passengers.total = this.passengers.adults + this.passengers.children;
    // Set the number of seats based on the cabin class
    this.seats[
        this.cabinClass as
            | "economy"
            | "premiumEconomy"
            | "business"
            | "firstClass"
    ] = this.passengers.total;

    next();
});

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
