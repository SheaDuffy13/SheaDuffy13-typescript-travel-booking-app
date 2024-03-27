import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import hotelRoutes from './routes/hotelRoutes';
// import flightRoutes from './routes/flightRoutes';
// import bookingRoutes from './routes/bookingRoutes';
import dotenv from 'dotenv';

dotenv.config();

const DB_URI = process.env.DB_URI as string;
const port: string | number = process.env.PORT || 3500;
const app = express();

const corsOptions = {
  origin: ['http://localhost:3000'],
  optionsSuccessStatus: 200
}

mongoose.connect(DB_URI)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error', err));

app.use(express.json()); // for parsing application/json
app.use(cors(corsOptions))

app.get("/api", (req: Request, res: Response) => {
    res.send({ message: "Hello from Express!" });
});

app.use('/api/user', userRoutes);
app.use('/api/hotels', hotelRoutes);
// app.use('/api/flights', flightRoutes);
// app.use('/api/bookings', bookingRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
