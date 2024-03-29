import React, { useState, useEffect } from 'react';
import { TextField, Select, MenuItem, Grid, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays } from 'date-fns';
import { Autocomplete } from '@mui/material';
import axios from 'axios';
import api from '../api/api';
import TravellerSelection from './TravellerSelection'

const SearchBar: React.FC = () => {
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [flyingFrom, setFlyingFrom] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [flyingFromResults, setFlyingFromResults] = useState<any[]>([]);
  const [destinationResults, setDestinationResults] = useState<any[]>([]);

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
      // renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
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
      // renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
    />
  </LocalizationProvider>
</Grid>

        <Grid item xs={12} sm={3}>
          <TravellerSelection />
          {/* <Select variant="outlined" fullWidth defaultValue={1}>
            <MenuItem value={1}>1 Adult</MenuItem>
            <MenuItem value={2}>2 Adults</MenuItem>
          </Select> */}
        </Grid>
      </Grid>
    </Box>
  );
}

export default SearchBar;
