import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import flightRoutes from "./routes/flightRoutes";
import locationRoutes from "./routes/locationRoutes";
import dotenv from "dotenv";
import { User } from "./models/User";
import bcrypt from "bcrypt";

dotenv.config();

const DB_URI = process.env.DB_URI as string;
const port: string | number = process.env.PORT || 3500;
const app = express();

const corsOptions = {
    origin: ["http://localhost:3000"],
    optionsSuccessStatus: 200,
};

mongoose
    .connect(DB_URI)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error", err));

app.use(express.json()); // for parsing application/json
app.use(cors(corsOptions));

app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/locations", locationRoutes);

User.findOne({ email: process.env.INITIAL_ADMIN_EMAIL }).then((user) => {
    if (!user) {
        bcrypt
            .hash(process.env.INITIAL_ADMIN_PASSWORD, 10)
            .then((hashedPassword) => {
                const adminUser = new User({
                    email: process.env.INITIAL_ADMIN_EMAIL,
                    firstName: process.env.INITIAL_ADMIN_FIRST_NAME,
                    lastName: process.env.INITIAL_ADMIN_LAST_NAME,
                    password: hashedPassword,
                    role: "admin",
                });
                adminUser.save().then(() => console.log("Admin user created"));
            });
    } else {
        console.log("Admin user exists in db");
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
