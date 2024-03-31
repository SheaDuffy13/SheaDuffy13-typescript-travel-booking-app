import { Flight } from "../models/Flight";
import { Request, Response } from "express";
import { Location } from "../models/Location";

// Create a new flight
export const createFlight = async (req: Request, res: Response) => {
    try {
        const flight = new Flight({
            ...req.body,
            seats: {
                economy: req.body.seats,
                premiumEconomy: req.body.seats,
                business: req.body.seats,
                firstClass: req.body.seats,
            },
            availableSeats: {
                economy: req.body.seats,
                premiumEconomy: req.body.seats,
                business: req.body.seats,
                firstClass: req.body.seats,
            },
        });
        await flight.save();
        res.status(201).send(flight);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all flights
export const getAllFlights = async (req: Request, res: Response) => {
    try {
        const flights = await Flight.find({});
        res.send(flights);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a flight by ID
export const getFlightById = async (req: Request, res: Response) => {
    const _id = req.params.id;
    try {
        const flight = await Flight.findById(_id);
        if (!flight) {
            return res.status(404).send();
        }
        res.send(flight);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a flight by ID
export const updateFlightById = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        "departure",
        "destination",
        "date",
        "seats",
        "price",
        "duration",
        "status",
        "bookingCount",
    ];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        const flight = await Flight.findById(req.params.id);

        if (!flight) {
            return res.status(404).send();
        }

        updates.forEach((update) => (flight[update] = req.body[update]));

        // Recalculate availableSeats
        if (updates.includes("seats") || updates.includes("bookingCount")) {
            flight.availableSeats.economy =
                flight.seats.economy - flight.bookingCount;
            flight.availableSeats.premiumEconomy =
                flight.seats.premiumEconomy - flight.bookingCount;
            flight.availableSeats.business =
                flight.seats.business - flight.bookingCount;
            flight.availableSeats.firstClass =
                flight.seats.firstClass - flight.bookingCount;
        }

        await flight.save();

        res.send(flight);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a flight by ID
export const deleteFlightById = async (req: Request, res: Response) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);

        if (!flight) {
            return res.status(404).send();
        }

        res.send(flight);
    } catch (error) {
        res.status(500).send(error);
    }
};

// search flights
export const searchFlights = async (req: Request, res: Response) => {
    try {
        const { departure, destination, date, travellers, cabinClass } =
            req.query;

        // Assert that departure and destination are strings
        if (typeof departure !== "string" || typeof destination !== "string") {
            return res
                .status(400)
                .send({ error: "Invalid departure or destination!" });
        }

        // Convert location names to ObjectIds
        const departureLocation = await Location.findOne({ name: departure });
        const destinationLocation = await Location.findOne({
            name: destination,
        });

        if (!departureLocation || !destinationLocation) {
            return res
                .status(400)
                .send({ error: "Invalid departure or destination!" });
        }

        const departureId = departureLocation._id;
        const destinationId = destinationLocation._id;

        // Convert date string to Date object
        const dateObj = new Date(date as string);

        // Find flights that match the search criteria
        const flights = await Flight.find({
            departure: departureId,
            destination: destinationId,
            date: {
                $gte: dateObj,
                $lt: new Date(dateObj.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to the date
            },
            [`availableSeats.${cabinClass}`]: { $gte: travellers },
        }).select(
            "flightNumber departure destination date seats price availableSeats duration status"
        ); // Select the fields to return

        res.send(flights);
    } catch (error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).send(error);
    }
};

// Get all flights departing from a location within the next month
export const getMonthlyFlights = async (req: Request, res: Response) => {
    try {
        const { location } = req.query;

        // Assert that location is a string
        if (typeof location !== "string") {
            return res.status(400).send({ error: "Invalid location!" });
        }

        // Convert location name to ObjectId
        const locationObj = await Location.findOne({ name: location });

        if (!locationObj) {
            return res.status(400).send({ error: "Invalid location!" });
        }

        const locationId = locationObj._id;

        // Calculate date range for the next month
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 1);

        // Find flights that match the search criteria
        const flights = await Flight.find({
            departure: locationId,
            date: {
                $gte: startDate,
                $lt: endDate,
            },
        }).populate("departure destination"); // Populate departure and destination fields

        res.send(flights);
    } catch (error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        res.status(500).send(error);
    }
};
