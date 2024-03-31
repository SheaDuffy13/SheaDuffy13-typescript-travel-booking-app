import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { Autocomplete } from '@mui/material';
import api from '../api/api';

const MonthlyFlights: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);

  useEffect(() => {
    if (location) {
      api.get(`/locations/search?term=${location}`)
        .then(res => setLocationResults(res.data))
        .catch(err => console.error(err));
    }
  }, [location]);

  const handleSearch = () => {
    api.get(`/flights/monthly?location=${location}`)
        .then(res => setFlights(res.data))
        .catch(err => {
            console.error(err);
    });
  };

  return (
    <div>
      <Autocomplete
        options={locationResults}
        getOptionLabel={(option) => option.name}
        getOptionKey={(option) => option._id}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        renderInput={(params) => 
          <TextField 
            {...params} 
            label="Departure Location" 
            variant="outlined"
          />
        }
        onInputChange={(event, newInputValue) => {
          setLocation(newInputValue);
        }}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>Search Monthly Flights</Button>
      {flights.map(flight => (
        <div key={flight._id}>
          <h2>Flight Number: {flight.flightNumber}</h2>
          <p>Departure: {flight.departure.name}</p>
          <p>Destination: {flight.destination.name}</p>
          <p>Price: ${flight.price.toFixed(2)}</p>
          <p>Duration: {flight.duration} hours</p>
          <p>Date: {new Date(flight.date).toLocaleString()}</p>
          <p>Economy Seats Available: {flight.availableSeats.economy}</p>
        <p>Premium Economy Seats Available: {flight.availableSeats.premiumEconomy}</p>
        <p>Business Seats Available: {flight.availableSeats.business}</p>
        <p>First Class Seats Available: {flight.availableSeats.firstClass}</p>
        </div>
      ))}
    </div>
  );
}

export default MonthlyFlights;
