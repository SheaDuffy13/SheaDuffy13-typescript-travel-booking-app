import mongoose, { Document, Schema } from "mongoose";

interface ILocation extends Document {
    name: string;
    // code: string; // IATA code
}

const LocationSchema: Schema = new Schema({
    name: { type: String, required: true },
    // code: { type: String, required: true }
});

export const Location = mongoose.model<ILocation>("Location", LocationSchema);
