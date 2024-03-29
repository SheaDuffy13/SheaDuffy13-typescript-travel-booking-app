import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Grid, Box, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';
import { Autocomplete } from '@mui/material';
import api from '../api/api';
import TravellerSelection from './TravellerSelection'

interface IFlight {
  _id: string;
  flightNumber: string;
  departure: { name: string };
  destination: { name: string };
  price: number;
  duration: number;
  date: string;
}


interface SearchBarProps {
  setFlights: (flights: IFlight[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setFlights }) => {
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [flyingFrom, setFlyingFrom] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [flyingFromResults, setFlyingFromResults] = useState<any[]>([]);
  const [destinationResults, setDestinationResults] = useState<any[]>([]);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabinClass, setCabinClass] = useState('Economy');

  useEffect(() => {
    if (flyingFrom) {
      api.get(`/locations/search?term=${flyingFrom}`)
        .then(res => setFlyingFromResults(res.data))
        .catch(err => console.error(err));
    }
  }, [flyingFrom]);

  useEffect(() => {
    if (destination) {
      api.get(`/locations/search?term=${destination}`)
        .then(res => setDestinationResults(res.data))
        .catch(err => console.error(err));
    }
  }, [destination]);

  const handleSelectionChange = (adults: number, children: number, cabinClass: string) => {
    setAdults(adults);
    setChildren(children);
    setCabinClass(cabinClass);
  };

  const handleSearch = () => {
    if (departureDate) {
      const dateStr = departureDate.toISOString();
      api.get('/flights/search', {
        params: {
          departure: flyingFrom,
          destination: destination,
          date: dateStr
        }
      })
      .then(response => {
        setFlights(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    } else {
      console.error('Departure date is required');
    }
  };


  return (
    <Box sx={{ width: "100%", padding: 2, boxSizing: "border-box" }}>
      <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={3}>
  <Autocomplete
    options={flyingFromResults}
    getOptionLabel={(option) => option.name}
    getOptionKey={(option) => option._id}
    renderInput={(params) => <TextField {...params} label="Flying From" variant="outlined" />}
    onInputChange={(event, newInputValue) => {
      setFlyingFrom(newInputValue);
    }}
  />
</Grid>
<Grid item xs={12} sm={2}>
  <Autocomplete
    options={destinationResults}
    getOptionLabel={(option) => option.name}
    getOptionKey={(option) => option._id}
    renderInput={(params) => <TextField {...params} label="Destination" variant="outlined" />}
    onInputChange={(event, newInputValue) => {
      setDestination(newInputValue);
    }}
  />
</Grid>

<Grid item xs={6} sm={2}>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      label="Departure"
      value={departureDate}
      onChange={(newValue) => {
        setDepartureDate(newValue);
      }}
      minDate={addDays(new Date(), 0)} // set minDate to today
    />
  </LocalizationProvider>
</Grid>
<Grid item xs={6} sm={2}>
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      label="Return"
      value={returnDate}
      onChange={(newValue) => {
        setReturnDate(newValue);
      }}
      minDate={departureDate ? addDays(new Date(departureDate), 0) : addDays(new Date(), 0)} // set minDate to the day of departure date, or today if no departure date is selected
    />
  </LocalizationProvider>
</Grid>

<Grid item xs={12} sm={3}>
      <TravellerSelection onSelectionChange={handleSelectionChange} />
    </Grid>
    <Grid item xs={12}>
      <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
    </Grid>
      </Grid>
    </Box>
  );
}

export default SearchBar;
