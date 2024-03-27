import Hotel from '../models/Hotel';
import { Request, Response } from 'express';

// GET all hotels
export const getAllHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST a new hotel
export const createHotel = async (req: Request, res: Response) => {
    const hotel = new Hotel(req.body);
  
    try {
      const newHotel = await hotel.save();
      res.status(201).json(newHotel);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

// DELETE a hotel
export const deleteHotel = async (req: Request, res: Response) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) {
            return res.status(404).json({ message: 'Cannot find hotel' });
        }
        res.json({ message: 'Deleted Hotel' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

// PUT update a hotel
export const updateHotel = async (req: Request, res: Response) => {
    try {
        const updatedHotel  = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedHotel) {
            return res.status(404).json({ message: 'Cannot find hotel' });
        }
        res.json(updatedHotel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// GET a hotel by ID
export const getHotelById = async (req: Request, res: Response) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Cannot find hotel' });
        }
        res.json(hotel);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
