import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";

interface Location {
    _id: string;
    name: string;
}

interface Flight {
    _id: string;
    flightNumber: string;
    departure: Location;
    destination: Location;
    date: Date;
}

interface Booking {
    _id: string;
    flight: Flight;
    seats: {
        economy: number;
        premiumEconomy: number;
        business: number;
        firstClass: number;
    };
}

interface User {
    firstName: string;
    lastName: string;
    email: string;
    // bookings: Booking[];
}

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        // Check if the token is expired
        const decodedToken: any = jwtDecode(token as string);
        const expirationDate = decodedToken.exp * 1000; // Convert to milliseconds
        const isExpired = Date.now() > expirationDate;

        if (!token || isExpired) {
            window.location.href = "/signup";
            return;
        }

        if (token && userId) {
            api.get(`/user/${userId}`)
                .then((res) => setUser(res.data))
                .catch((err) => console.error(err));

            api.get(`/booking/user/${userId}`)
                .then((res) => {
                    const bookingPromises = res.data.map((booking: Booking) =>
                        api
                            .get(`/flights/${booking.flight}`)
                            .then((flightRes) => {
                                return api
                                    .get(
                                        `/locations/${flightRes.data.departure}`
                                    )
                                    .then((departureRes) => {
                                        flightRes.data.departure =
                                            departureRes.data;
                                        return api.get(
                                            `/locations/${flightRes.data.destination}`
                                        );
                                    })
                                    .then((destinationRes) => {
                                        flightRes.data.destination =
                                            destinationRes.data;
                                        return {
                                            ...booking,
                                            flight: flightRes.data,
                                        };
                                    });
                            })
                    );
                    Promise.all(bookingPromises)
                        .then((completeBookings) =>
                            setBookings(completeBookings)
                        )
                        .catch((err) => console.error(err));
                })
                .catch((err) => console.error(err));
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/";
    };

    const handleDeleteAccount = () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (token && userId) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            api.delete(`/user/${userId}`)
                .then(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    window.location.href = "/";
                })
                .catch((err) => console.error(err));
        }
    };

    if (!user) {
        return <Typography variant="h6">Loading...</Typography>;
    }
    console.log(bookings);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 5,
            }}
        >
            <Typography variant="h4">Profile</Typography>
            <Typography variant="h6">
                {user.firstName} {user.lastName}
            </Typography>
            <Typography>{user.email}</Typography>

            <Typography variant="h6">Bookings</Typography>
            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <Box key={booking._id}>
                        <Typography>
                            Flight Number: {booking.flight.flightNumber}
                        </Typography>
                        <Typography>
                            Date:{" "}
                            {new Date(booking.flight.date).toLocaleString()}
                        </Typography>
                        <Typography>
                            Departure: {booking.flight.departure.name}
                        </Typography>
                        <Typography>
                            Destination: {booking.flight.destination.name}
                        </Typography>
                        <Typography>
                            Economy Seats: {booking.seats.economy}
                        </Typography>
                        <Typography>
                            Premium Economy Seats:{" "}
                            {booking.seats.premiumEconomy}
                        </Typography>
                        <Typography>
                            Business Seats: {booking.seats.business}
                        </Typography>
                        <Typography>
                            First Class Seats: {booking.seats.firstClass}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography>No flights booked</Typography>
            )}

            <Button
                variant="contained"
                color="secondary"
                onClick={handleSignOut}
                sx={{ mt: 2 }}
            >
                Sign Out
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteAccount}
                sx={{ mt: 5 }}
            >
                Delete Account
            </Button>
        </Box>
    );
};

export default ProfilePage;
