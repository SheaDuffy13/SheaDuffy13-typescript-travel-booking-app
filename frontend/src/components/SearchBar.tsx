import React, { useState } from 'react';
import { TextField, Select, MenuItem, Grid, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const SearchBar: React.FC = () => {
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  return (
    <Box sx={{ width: "100%", padding: 2, boxSizing: "border-box" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField label="Flying From" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField label="Destination" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={6} sm={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Departure"
              value={departureDate}
              onChange={(newValue) => {
                setDepartureDate(newValue);
              }}
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
              // renderInput={(params) => <TextField {...params} variant="outlined" fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Select variant="outlined" fullWidth defaultValue={1}>
            <MenuItem value={1}>1 Adult</MenuItem>
            <MenuItem value={2}>2 Adults</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SearchBar;
