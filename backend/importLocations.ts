// run with  npx ts-node importLocations.ts

import fs from 'fs';
import mongoose from 'mongoose';
import Location from './src/models/Location';
import dotenv from 'dotenv';


async function importLocations() {
dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.DB_URI as string);

// Read the locations from the text file
const locations = JSON.parse(fs.readFileSync('locations.txt', 'utf-8'));

// Insert the locations into the MongoDB
try {
  const docs = await Location.insertMany(locations);
  console.log('Locations imported successfully');
} catch (error) {
  console.error(error);
} finally {
  mongoose.connection.close();
}
}


importLocations();
