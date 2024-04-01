import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Grid,
    Typography,
    CardContent,
    Card,
    Container,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import api from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface Flight {
    _id: string;
    flightNumber: string;
    departure: { name: string };
    destination: { name: string };
    price: number;
    date: string;
    availableSeats: {
        economy: number;
        premiumEconomy: number;
        business: number;
        firstClass: number;
    };
}

interface User {
    userId: string;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
}

const BookingPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [flight, setFlight] = useState<Flight | null>(null);
    const [open, setOpen] = useState(false);
    const [cabinClass, setCabinClass] = useState("Economy");
    const [passengers, setPassengers] = useState(1);
    const [children, setChildren] = useState(0);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        let userId = "";
        if (token) {
            const decoded = jwtDecode<User>(token);
            userId = decoded.userId;
        }

        const fetchData = async () => {
            try {
                const [userResponse, flightResponse] = await Promise.all([
                    api.get(`/user/${userId}`),
                    api.get(`/flights/${id}`),
                ]);

                const user = userResponse.data;
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setEmail(user.email);

                setFlight(flightResponse.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (flight) {
            try {
                const token = localStorage.getItem("token");
                let userId = "";
                if (token) {
                    const decoded = jwtDecode<User>(token);
                    userId = decoded.userId;
                }

                const response = await api.post("/booking", {
                    user: userId,
                    flight: flight._id,
                    passengers: {
                        adults: passengers,
                        children: children,
                    },
                    cabinClass,
                    seats: {
                        economy:
                            cabinClass === "Economy"
                                ? passengers + children
                                : 0,
                        premiumEconomy:
                            cabinClass === "PremiumEconomy"
                                ? passengers + children
                                : 0,
                        business:
                            cabinClass === "Business"
                                ? passengers + children
                                : 0,
                        firstClass:
                            cabinClass === "FirstClass"
                                ? passengers + children
                                : 0,
                    },
                });
                console.log("Booking confirmed:", response.data);
                setOpen(true);
            } catch (error) {
                console.error("Failed to create booking:", error);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    if (!flight) {
        return <div>No flight found</div>;
    }

    return (
        <Container maxWidth="sm">
            <h1>Flight Details</h1>
            <Card sx={{ minWidth: 275, mb: 2 }}>
                <CardContent>
                    <Typography variant="body2">
                        Flight Number: {flight.flightNumber}
                    </Typography>
                    <Typography variant="body2">
                        Date: {new Date(flight.date).toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                        Departure: {flight.departure.name}
                    </Typography>
                    <Typography variant="body2">
                        Destination: {flight.destination.name}
                    </Typography>
                    <Typography variant="body2">
                        Economy Seats Available: {flight.availableSeats.economy}
                    </Typography>
                    <Typography variant="body2">
                        Premium Economy Seats Available:{" "}
                        {flight.availableSeats.premiumEconomy}
                    </Typography>
                    <Typography variant="body2">
                        Business Seats Available:{" "}
                        {flight.availableSeats.business}
                    </Typography>
                    <Typography variant="body2">
                        First Class Seats Available:{" "}
                        {flight.availableSeats.firstClass}
                    </Typography>
                </CardContent>
            </Card>
            <Box sx={{ mt: 7 }}>
                <h2>Confirm your booking</h2>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="First Name"
                                value={firstName}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Last Name"
                                value={lastName}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                value={email}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Cabin Class"
                                value={cabinClass}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Number of Passengers"
                                value={passengers}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Confirm Booking
                    </Button>
                </form>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Booking Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Your booking has been confirmed! You will receive an
                        email confirmation shortly.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default BookingPage;
