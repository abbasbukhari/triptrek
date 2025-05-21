// code for flightAPI simulator enhancement - provides realstic flight data

const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Airport codes with full names for reference
const airports = {
  'YYZ': 'Toronto Pearson International',
  'YVR': 'Vancouver International',
  'YUL': 'Montreal-Pierre Elliott Trudeau International',
  'YYC': 'Calgary International',
  'JFK': 'John F. Kennedy International',
  'LAX': 'Los Angeles International',
  'LHR': 'London Heathrow',
  'CDG': 'Paris Charles de Gaulle',
  'HND': 'Tokyo Haneda',
  'DXB': 'Dubai International'
};

const airlines = ['Air Canada', 'Delta', 'United', 'WestJet', 'American Airlines', 'British Airways', 'Lufthansa', 'Emirates'];

function randomTime(startHour) {
  const hour = startHour + Math.floor(Math.random() * 5);
  const min = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

function randomPrice(base = 200, variance = 400) {
  return (base + Math.random() * variance).toFixed(2);
}

function generateFlightNumber(airline) {
  const codes = {
    'Air Canada': 'AC',
    'Delta': 'DL',
    'United': 'UA',
    'WestJet': 'WJ',
    'American Airlines': 'AA',
    'British Airways': 'BA',
    'Lufthansa': 'LH',
    'Emirates': 'EK'
  };
  
  const prefix = codes[airline] || 'XX';
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${number}`;
}

// Getting flights from database or make mock flights
router.post('/', async (req, res) => {
  const { from, to, date, returnDate, type } = req.body; // type: 'oneway' or 'return'
  
  try {
    // Fetching flights from database
    let dbFlights = await db('flights')
      .where({
        from_airport: from,
        to_airport: to,
        departure_date: date
      })
      .orderBy('departure_time');
    
    // If there are prseent flights in database, return them
    if (dbFlights && dbFlights.length > 0) {
      const flights = dbFlights.map(flight => ({
        airline: flight.airline,
        flight_number: flight.flight_number,
        from,
        to,
        date: flight.departure_date,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        price: flight.price,
        returnFlight: null
      }));
      
      // Add return flights if requested
      if (type === 'return' && returnDate) {
        for (let i = 0; i < flights.length; i++) {
          const returnDbFlights = await db('flights')
            .where({
              from_airport: to,
              to_airport: from,
              departure_date: returnDate
            })
            .orderBy('departure_time');
            
          if (returnDbFlights && returnDbFlights.length > 0) {
            // Use a random return flight from results
            const returnFlight = returnDbFlights[Math.floor(Math.random() * returnDbFlights.length)];
            flights[i].returnFlight = {
              airline: returnFlight.airline,
              flight_number: returnFlight.flight_number,
              from: to,
              to: from,
              date: returnFlight.departure_date,
              departure_time: returnFlight.departure_time,
              arrival_time: returnFlight.arrival_time,
              price: returnFlight.price
            };
          }
        }
      }
      
      return res.json({ flights });
    }
    
    // If no flights in DB, generate mock data
    const flights = Array.from({ length: 3 }).map((_, i) => {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const depTime = randomTime(6 + i * 3);
      const arrTime = randomTime(9 + i * 3);
      const priceOneWay = randomPrice();
      let returnFlight = null;
      
      if (type === 'return' && returnDate) {
        const returnDepTime = randomTime(6 + i * 3);
        const returnArrTime = randomTime(9 + i * 3);
        returnFlight = {
          airline: airlines[Math.floor(Math.random() * airlines.length)],
          flight_number: generateFlightNumber(airlines[Math.floor(Math.random() * airlines.length)]),
          from: to,
          to: from,
          date: returnDate,
          departure_time: returnDepTime,
          arrival_time: returnArrTime,
          price: randomPrice()
        };
      }
      
      return {
        airline,
        flight_number: generateFlightNumber(airline),
        from,
        to,
        date,
        departure_time: depTime,
        arrival_time: arrTime,
        price: priceOneWay,
        returnFlight
      };
    });
    
    res.json({ flights });
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to fetch flight data' });
  }
});

module.exports = router;