import { Request, Response } from "express";
import { Booking } from "../models/Booking";
import { Flight } from "../models/Flight";

interface RequestWithUser extends Request {
    userId?: string;
}

// Create a new booking
export const createBooking = async (req: RequestWithUser, res: Response) => {
    try {
        const flight = await Flight.findById(req.body.flight);
        if (!flight) {
            return res.status(404).send({ error: "Flight not found" });
        }

        const totalPassengers = req.body.adults + req.body.children;
        if (
            flight.availableSeats[
                req.body.cabinClass as
                    | "economy"
                    | "premiumEconomy"
                    | "business"
                    | "firstClass"
            ] < totalPassengers
        ) {
            return res
                .status(400)
                .send({ error: "Not enough available seats on the flight" });
        }

        const booking = new Booking({
            ...req.body,
            user: req.userId, // Add the user's ID to the booking
        });
        const savedBooking = await booking.save();

        flight.availableSeats[
            req.body.cabinClass as
                | "economy"
                | "premiumEconomy"
                | "business"
                | "firstClass"
        ] -= totalPassengers;
        flight.bookings.push(savedBooking._id);
        await flight.save();

        res.status(201).json(savedBooking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a specific booking
export const getBooking = async (req: Request, res: Response) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getBookingsByUser = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
