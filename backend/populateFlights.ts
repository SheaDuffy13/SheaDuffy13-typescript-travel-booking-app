// RUN WITH: npx ts-node populateFlights.ts
import mongoose, { Document, Schema } from "mongoose";
import dotenv from "dotenv";
import { Flight } from "./src/models/Flight";
import { Location } from "./src/models/Location";

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
    duration: number;
    status: "active" | "canceled" | "delayed";
    bookings: Schema.Types.ObjectId[];
}

async function populateDatabase() {
    dotenv.config();

    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI as string);

    // Get all major Australian cities from the database
    const cities = [
        "Sydney, New South Wales",
        "Melbourne, Victoria",
        "Brisbane, Queensland",
        "Perth, Western Australia",
        "Adelaide, South Australia",
        "Gold Coast, Queensland",
        "Canberra, Australian Capital Territory",
        "Hobart, Tasmania",
        "Darwin, Northern Territory",
    ];

    const locations = await Location.find({ name: { $in: cities } });

    // Generate a set of unique flight numbers
    const flightNumbers = new Set<string>();
    while (
        flightNumbers.size <
        ((locations.length * (locations.length - 1)) / 2) * 30
    ) {
        const flightNumber = `FA${Math.floor(1000 + Math.random() * 9000)}`; // Generates a random number between 1000 and 9999
        flightNumbers.add(flightNumber);
    }

    const flightNumbersArray = Array.from(flightNumbers);
    const flightNumbersIterator = flightNumbersArray.values();

    // Generate a bunch of fake flights
    for (let i = 0; i < locations.length; i++) {
        for (let j = i + 1; j < locations.length; j++) {
            const departureLocation = locations[i];
            const destinationLocation = locations[j];

            for (let k = 0; k < 30; k++) {
                // Generate flights for the next 30 days
                const seats = {
                    economy: Math.floor(Math.random() * 200) + 50, // Random number of seats between 50 and 250
                    premiumEconomy: Math.floor(Math.random() * 200) + 50,
                    business: Math.floor(Math.random() * 200) + 50,
                    firstClass: Math.floor(Math.random() * 200) + 50,
                };
                const flightNumber = flightNumbersIterator.next().value;

                const flight = new Flight({
                    flightNumber,
                    departure: departureLocation._id,
                    destination: destinationLocation._id,
                    date: new Date(Date.now() + k * 24 * 60 * 60 * 1000), // Each day within the next 30 days
                    seats,
                    price: Math.floor(Math.random() * 500) + 100, // Random price between 100 and 600
                    availableSeats: seats, // Set available seats equal to total seats
                    bookingCount: 0, // Set booking count to 0
                    duration: Math.floor(Math.random() * 10) + 1, // Random duration between 1 and 11 hours
                    status: "active",
                    bookings: [], // Initialize bookings as an empty array
                });

                await flight.save();
            }
        }
    }

    console.log("Database populated with fake flights!");
    mongoose.connection.close();
}

populateDatabase().catch(console.error);
