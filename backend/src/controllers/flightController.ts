import { Flight } from '../models/Flight';
import { Request, Response } from 'express';
import { Location } from '../models/Location';

// Create a new flight
export const createFlight = async (req: Request, res: Response) => {
  try {
    const flight = new Flight(req.body);
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
  const allowedUpdates = ['departure', 'destination', 'date', 'seats', 'price', 'duration', 'status', 'bookingCount'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).send();
    }

    updates.forEach(update => flight[update] = req.body[update]);

    // Recalculate availableSeats
    if (updates.includes('seats') || updates.includes('bookingCount')) {
      flight.availableSeats = flight.seats - flight.bookingCount;
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

export const searchFlights = async (req: Request, res: Response) => {
  try {
    const { departure, destination, date } = req.query;

    // Assert that departure and destination are strings
    if (typeof departure !== 'string' || typeof destination !== 'string') {
      return res.status(400).send({ error: 'Invalid departure or destination!' });
    }

    // Convert location names to ObjectIds
    const departureLocation = await Location.findOne({ name: departure });
    const destinationLocation = await Location.findOne({ name: destination });

    if (!departureLocation || !destinationLocation) {
      return res.status(400).send({ error: 'Invalid departure or destination!' });
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
    });

    res.send(flights);
  } catch (error) {
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).send(error);
  }
};




