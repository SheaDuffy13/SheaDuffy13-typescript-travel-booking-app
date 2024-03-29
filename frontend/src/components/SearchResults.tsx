import React from 'react';

interface Flight {
  _id: string;
  flightNumber: string;
  departure: { name: string };
  destination: { name: string };
  price: number;
  duration: number;
  date: string;
}

interface SearchResultsProps {
  flights: Flight[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ flights }) => {
    if (flights.length === 0) {
      return <p>No flights were found for your search criteria. Please try again with different parameters.</p>;
    }
  
    return (
      <div>
        {flights.map(flight => (
          <div key={flight._id}>
            <h2>Flight Number: {flight.flightNumber}</h2>
            <p>Departure: {flight.departure.name}</p>
            <p>Destination: {flight.destination.name}</p>
            <p>Price: ${flight.price.toFixed(2)}</p>
            <p>Duration: {flight.duration} hours</p>
            <p>Date: {new Date(flight.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    );
  };
  

export default SearchResults;
