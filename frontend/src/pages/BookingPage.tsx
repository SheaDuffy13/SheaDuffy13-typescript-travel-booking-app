import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

interface Flight {
    _id: string;
    flightNumber: string;
    departure: { name: string };
    destination: { name: string };
    price: number;
    duration: number;
    date: string;
    availableSeats: {
        economy: number;
        premiumEconomy: number;
        business: number;
        firstClass: number;
    };
}

const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [flight, setFlight] = useState<Flight | null>(null);
    const user = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cabinClass, setCabinClass] = useState("Economy");
    const [passengers, setPassengers] = useState(1);
    const [children, setChildren] = useState(0);

    useEffect(() => {
        if (user) {
            setName(user.firstName + " " + user.lastName);
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const response = await api.get(`/flights/${id}`);
                setFlight(response.data);
            } catch (error) {
                console.error("Failed to fetch flight:", error);
            }
        };

        fetchFlight();
    }, [id]);

    if (!user) {
        navigate("/login");
        return null;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (user && flight) {
            try {
                const response = await api.post("/bookings", {
                    user: user._id,
                    flight: flight._id,
                    passengers: {
                        adults: passengers,
                        children: children,
                    },
                    cabinClass,
                });

                console.log("Booking confirmed:", response.data);
            } catch (error) {
                console.error("Failed to create booking:", error);
            }
        }
    };

    if (!flight) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Flight Details</h1>
            <h2>Flight Number: {flight.flightNumber}</h2>
            <p>Departure: {flight.departure.name}</p>
            <p>Destination: {flight.destination.name}</p>
            <p>Price: ${flight.price.toFixed(2)}</p>
            <p>Duration: {flight.duration} hours</p>
            <p>Date: {new Date(flight.date).toLocaleString()}</p>
            <p>Economy Seats Available: {flight.availableSeats.economy}</p>
            <p>
                Premium Economy Seats Available:{" "}
                {flight.availableSeats.premiumEconomy}
            </p>
            <p>Business Seats Available: {flight.availableSeats.business}</p>
            <p>
                First Class Seats Available: {flight.availableSeats.firstClass}
            </p>
            <h2>Confirm your booking</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Cabin Class"
                    value={cabinClass}
                    onChange={(e) => setCabinClass(e.target.value)}
                    required
                />
                <TextField
                    label="Number of Passengers"
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    required
                />
                <Button type="submit">Confirm Booking</Button>
            </form>
        </div>
    );
};

export default BookingPage;
