import React from "react";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
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

    if (flights.length === 0) {
        return (
            <p>
                No flights were found for your search criteria. Please try again
                with different parameters.
            </p>
        );
    }

    return (
        <Grid container spacing={2} style={{ margin: "1em" }}>
            {flights.map((flight) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={flight._id}>
                    <Card sx={{ minWidth: 275, mb: 2 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body2">
                                        <strong>Flight Number:</strong>{" "}
                                        {flight.flightNumber}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Date:</strong>{" "}
                                        {new Date(flight.date).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Departure:</strong>{" "}
                                        {flight.departure.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Destination:</strong>{" "}
                                        {flight.destination.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2">
                                        <strong>Economy Seats:</strong>{" "}
                                        {flight.availableSeats.economy}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Premium Economy Seats:</strong>{" "}
                                        {flight.availableSeats.premiumEconomy}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Business Seats:</strong>{" "}
                                        {flight.availableSeats.business}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>First Class Seats:</strong>{" "}
                                        {flight.availableSeats.firstClass}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    // Check if the user's token exists in local storage
                                    if (localStorage.getItem("token")) {
                                        // If the token exists, the user is logged in and can book a flight
                                        navigate(`/booking/${flight._id}`);
                                    } else {
                                        // If the token doesn't exist, redirect the user to the login page
                                        navigate("/signup");
                                    }
                                }}
                                style={{ marginTop: "1em" }}
                            >
                                Book this flight
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default SearchResults;
