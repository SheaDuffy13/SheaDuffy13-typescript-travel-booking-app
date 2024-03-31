import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SearchBar from "../components/SearchBar";
import SearchResults from "../components/SearchResults";
import MonthlyFlights from "../components/MonthlyFlights";

interface Flight {
    _id: string;
    flightNumber: string;
    departure: { name: string };
    destination: { name: string };
    price: number;
    duration: number;
    date: string;
    availableSeats: {
        economy: number;
        premiumEconomy: number;
        business: number;
        firstClass: number;
    };
}

const HomePage: React.FC = () => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [searchClicked, setSearchClicked] = useState(false);

    const handleSearch = (flights: Flight[]) => {
        setFlights(flights);
        setSearchClicked(true);
    };

    useEffect(() => {
        setSearchClicked(false);
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                pt: 2,
                width: "100%",
            }}
        >
            <SearchBar setFlights={handleSearch} />
            {searchClicked && <SearchResults flights={flights} />}
            <MonthlyFlights />
        </Box>
    );
};

export default HomePage;
