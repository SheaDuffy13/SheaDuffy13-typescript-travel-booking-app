import { Location } from "../models/Location";
import { Request, Response } from "express";

// Get all locations
export const getAllLocations = async (req: Request, res: Response) => {
    try {
        const locations = await Location.find({});
        res.send(locations);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a location by ID
export const getLocationById = async (req: Request, res: Response) => {
    const _id = req.params.id;
    try {
        const location = await Location.findById(_id);
        if (!location) {
            return res.status(404).send();
        }
        res.send(location);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Create a new location
export const createLocation = async (req: Request, res: Response) => {
    const location = new Location(req.body);
    try {
        await location.save();
        res.status(201).send(location);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Update a location by ID
export const updateLocationById = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name"];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        const location = await Location.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!location) {
            return res.status(404).send();
        }

        res.send(location);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a location by ID
export const deleteLocationById = async (req: Request, res: Response) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);

        if (!location) {
            res.status(404).send();
        }

        res.send(location);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Search locations
export const searchLocations = async (req: Request, res: Response) => {
    const searchTerm = req.query.term as string;
    try {
        const locations = await Location.find({
            name: new RegExp("^" + searchTerm, "i"),
        });
        res.send(locations);
    } catch (error) {
        res.status(500).send(error);
    }
};
