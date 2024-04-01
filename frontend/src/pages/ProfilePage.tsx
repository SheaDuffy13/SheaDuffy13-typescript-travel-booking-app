import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
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
    const [open, setOpen] = useState(false);
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    // const [currentPassword, setCurrentPassword] = useState("");
    // const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const decodedToken: any = jwtDecode(token as string);
        const userId = decodedToken.userId;

        // Check if the token is expired
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

    const handleOpen = () => {
        setNewFirstName(user?.firstName || "");
        setNewLastName(user?.lastName || "");
        setNewEmail(user?.email || "");
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        const token = localStorage.getItem("token");
        const decodedToken: any = jwtDecode(token as string);
        const userId = decodedToken.userId;

        api.put(`/user/${userId}`, {
            firstName: newFirstName,
            lastName: newLastName,
            email: newEmail,
            // currentPassword,
            // newPassword,
        })
            .then((res) => {
                setUser(res.data);
                setOpen(false);
            })
            .catch((err) => console.error(err));
    };

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

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 5,
            }}
        >
            <Avatar sx={{ width: 56, height: 56, mb: 2 }}>U</Avatar>
            <Typography variant="h4">
                {user.firstName} {user.lastName}
            </Typography>
            <Typography>{user.email}</Typography>
            <Button onClick={handleOpen}>Edit Profile</Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="First Name"
                        type="text"
                        fullWidth
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Last Name"
                        type="text"
                        fullWidth
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                    {/* <TextField
                        margin="dense"
                        label="Current Password"
                        type="password"
                        fullWidth
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="New Password"
                        type="password"
                        fullWidth
                        onChange={(e) => setNewPassword(e.target.value)}
                    /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>

            <Typography variant="h6" sx={{ mt: 5 }}>
                Bookings
            </Typography>
            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <Card key={booking._id} sx={{ minWidth: 275, mb: 2 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2">
                                        Flight Number:{" "}
                                        {booking.flight.flightNumber}
                                    </Typography>
                                    <Typography variant="body2">
                                        Date:{" "}
                                        {new Date(
                                            booking.flight.date
                                        ).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Departure:{" "}
                                        {booking.flight.departure.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        Destination:{" "}
                                        {booking.flight.destination.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2">
                                        Economy Seats: {booking.seats.economy}
                                    </Typography>
                                    <Typography variant="body2">
                                        Premium Economy Seats:{" "}
                                        {booking.seats.premiumEconomy}
                                    </Typography>
                                    <Typography variant="body2">
                                        Business Seats: {booking.seats.business}
                                    </Typography>
                                    <Typography variant="body2">
                                        First Class Seats:{" "}
                                        {booking.seats.firstClass}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography>No flights booked</Typography>
            )}

            <Button
                variant="contained"
                sx={{ backgroundColor: "#3f51b5", color: "#fff", mt: 2 }}
                onClick={handleSignOut}
            >
                Sign Out
            </Button>
            <Button
                variant="contained"
                sx={{ backgroundColor: "#f44336", color: "#fff", mt: 5 }}
                onClick={handleDeleteAccount}
            >
                Delete Account
            </Button>
        </Box>
    );
};

export default ProfilePage;
