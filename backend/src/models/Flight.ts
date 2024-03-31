import mongoose, { Document, Schema } from "mongoose";

interface IFlight extends Document {
    flightNumber: string;
    departure: Schema.Types.ObjectId;
    destination: Schema.Types.ObjectId;
    date: Date;
    seats: {
        economy: number;
        premiumEconomy: number;
        business: number;
        firstClass: number;
    };
    price: number;
    availableSeats: {
        economy: number;
        premiumEconomy: number;
        business: number;
        firstClass: number;
    };
    bookingCount: number;
    duration: number;
    status: "active" | "canceled" | "delayed";
    bookings: Schema.Types.ObjectId[];
    [key: string]: any;
}

const FlightSchema: Schema = new Schema({
    flightNumber: { type: String, required: true, unique: true },
    departure: { type: Schema.Types.ObjectId, ref: "Location", required: true },
    destination: {
        type: Schema.Types.ObjectId,
        ref: "Location",
        required: true,
    },
    date: { type: Date, required: true },
    seats: {
        economy: { type: Number, required: true },
        premiumEconomy: { type: Number, required: true },
        business: { type: Number, required: true },
        firstClass: { type: Number, required: true },
    },
    price: { type: Number, required: true },
    availableSeats: {
        economy: {
            type: Number,
            default: function () {
                return this.seats.economy;
            },
        },
        premiumEconomy: {
            type: Number,
            default: function () {
                return this.seats.premiumEconomy;
            },
        },
        business: {
            type: Number,
            default: function () {
                return this.seats.business;
            },
        },
        firstClass: {
            type: Number,
            default: function () {
                return this.seats.firstClass;
            },
        },
    },
    bookingCount: { type: Number, default: 0 },
    duration: { type: Number, required: true },
    status: {
        type: String,
        enum: ["active", "canceled", "delayed"],
        default: "active",
    },
    bookings: [{ type: Schema.Types.ObjectId, ref: "Booking" }],
});

export const Flight = mongoose.model<IFlight>("Flight", FlightSchema);
