import React from 'react';
import { TextField, Select, MenuItem, Grid, Box } from '@mui/material';

const SearchBar: React.FC = () => {
  return (
    <Box sx={{ width: "100%", padding: 2, boxSizing: "border-box" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField label="Flying From" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField label="Destination" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField label="Departure | Return" variant="outlined" fullWidth />
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
