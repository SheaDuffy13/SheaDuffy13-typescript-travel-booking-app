import Flight from '../models/Flight';
import { Request, Response } from 'express';

export const createFlight = async (req: Request, res: Response) => {
  const flight = new Flight(req.body);
  try {
    await flight.save();
    res.status(201).send(flight);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getAllFlights = async (req: Request, res: Response) => {
  try {
    const flights = await Flight.find({});
    res.send(flights);
  } catch (error) {
    res.status(500).send(error);
  }
};

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

export const updateFlightById = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['flyingFrom', 'destination', 'departureDate', 'returnDate', 'adults', 'children', 'cabinClass'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!flight) {
      return res.status(404).send();
    }

    res.send(flight);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteFlightById = async (req: Request, res: Response) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);

    if (!flight) {
      res.status(404).send();
    }

    res.send(flight);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const searchFlights = async (req: Request, res: Response) => {
  // Implement search logic here
};
