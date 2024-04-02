import React, { useState, useEffect } from "react";
import {
    TextField,
    Select,
    MenuItem,
    Button,
    Popover,
    Box,
    InputAdornment,
    IconButton,
    Divider,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface TravellerSelectionProps {
    onSelectionChange: (
        adults: number,
        children: number,
        cabinClass: string
    ) => void;
}

const TravellerSelection: React.FC<TravellerSelectionProps> = ({
    onSelectionChange,
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [cabinClass, setCabinClass] = useState("economy");

    useEffect(() => {
        onSelectionChange(adults, children, cabinClass);
    }, []); // Runs when first rendered

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAdultsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        setAdults(value);
        if (value === 0) {
            setChildren(0);
        }
        onSelectionChange(value, children, cabinClass);
    };

    const handleChildrenChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseInt(event.target.value);
        setChildren(value);
        onSelectionChange(adults, value, cabinClass);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <div>
            <TextField
                label="Travellers / Cabin Class"
                variant="outlined"
                value={`${adults + children} travellers, ${cabinClass}`}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={handleClick}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <Box p={2}>
                    <h3>Travellers</h3>
                    <div>
                        <TextField
                            label="Adults"
                            type="number"
                            InputProps={{ inputProps: { min: 1 } }}
                            value={adults}
                            onChange={handleAdultsChange}
                            style={{ marginBottom: "10px" }}
                        />
                    </div>
                    <div>
                        <TextField
                            label="Children"
                            type="number"
                            InputProps={{
                                inputProps: {
                                    min: 0,
                                    max: adults > 0 ? 10 : 0,
                                },
                            }}
                            value={children}
                            onChange={handleChildrenChange}
                            fullWidth
                        />
                    </div>
                    <Box marginBottom="10px">
                        <Typography variant="caption" color="textSecondary">
                            Under 17 years
                        </Typography>
                    </Box>
                    <Divider />
                    <h3>Cabin Class</h3>
                    <Select
                        label="Cabin Class"
                        value={cabinClass}
                        onChange={(event) => setCabinClass(event.target.value)}
                    >
                        <MenuItem value="economy">Economy</MenuItem>
                        <MenuItem value="premiumEconomy">
                            Premium Economy
                        </MenuItem>
                        <MenuItem value="business">Business</MenuItem>
                        <MenuItem value="firstClass">First Class</MenuItem>
                    </Select>
                    <Divider />
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        marginTop="10px"
                    >
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary">
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </div>
    );
};

export default TravellerSelection;
