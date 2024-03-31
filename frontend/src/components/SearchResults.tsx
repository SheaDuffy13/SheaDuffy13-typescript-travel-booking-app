import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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

interface SearchResultsProps {
    flights: Flight[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ flights }) => {
    const navigate = useNavigate();
    const user = useAuth(); //null??

    if (flights.length === 0) {
        return (
            <p>
                No flights were found for your search criteria. Please try again
                with different parameters.
            </p>
        );
    }

    return (
        <div>
            {flights.map((flight) => (
                <div key={flight._id}>
                    <h2>Flight Number: {flight.flightNumber}</h2>
                    <p>Departure: {flight.departure.name}</p>
                    <p>Destination: {flight.destination.name}</p>
                    <p>Price: ${flight.price.toFixed(2)}</p>
                    <p>Duration: {flight.duration} hours</p>
                    <p>Date: {new Date(flight.date).toLocaleString()}</p>
                    <p>
                        Economy Seats Available: {flight.availableSeats.economy}
                    </p>
                    <p>
                        Premium Economy Seats Available:{" "}
                        {flight.availableSeats.premiumEconomy}
                    </p>
                    <p>
                        Business Seats Available:{" "}
                        {flight.availableSeats.business}
                    </p>
                    <p>
                        First Class Seats Available:{" "}
                        {flight.availableSeats.firstClass}
                    </p>
                    <div
                        onClick={() => {
                            if (user) {
                                navigate(`/booking/${flight._id}`);
                            } else {
                                navigate("/signup");
                            }
                        }}
                    >
                        Book this flight
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;
