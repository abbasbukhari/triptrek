const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mock flight data for fallback
const generateMockFlightData = (from, to, date) => {
  const airlines = ['American Airlines', 'British Airways', 'Delta', 'United', 'Air Canada', 'Lufthansa'];
  const flightNumbers = ['AA123', 'BA456', 'DL789', 'UA012', 'AC345', 'LH678'];
  const departureTimes = ['06:30', '09:45', '13:20', '16:15', '19:40', '22:10'];
  const arrivalTimes = ['08:45', '12:15', '15:50', '18:45', '22:10', '00:30'];
  const prices = [299, 349, 389, 409, 459, 499];
  
  return {
    success: true,
    currency: 'USD',
    results: Array.from({ length: 6 }, (_, i) => ({
      id: `mock-flight-${i}`,
      airline: airlines[i],
      flight_number: flightNumbers[i],
      departure: {
        airport_code: from,
        time: `${date}T${departureTimes[i]}:00`
      },
      arrival: {
        airport_code: to,
        time: `${date}T${arrivalTimes[i]}:00`
      },
      duration: {
        hours: Math.floor(Math.random() * 5) + 3,
        minutes: Math.floor(Math.random() * 60)
      },
      price: {
        amount: prices[i],
        currency: 'USD'
      },
      seats_remaining: Math.floor(Math.random() * 50) + 5,
      layovers: []
    }))
  };
};

// Handle the one-way flight search
router.get('/oneway', async (req, res) => {
  try {
    const {
      departure_airport_code,
      arrival_airport_code,
      departure_date,
      number_of_adults,
      number_of_children,
      number_of_infants,
      cabin_class,
      currency,
      region
    } = req.query;

    // Validate required parameters
    if (!departure_airport_code || !arrival_airport_code || !departure_date) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Searching for flights with params:', req.query);
    
    try {
      // Try to make the real API call
      console.log('Attempting to use real API with key:', process.env.FLIGHT_API_KEY);
      
      const response = await axios({
        method: 'GET',
        url: 'https://app.goflightlabs.com/flights',
        params: {
          access_key: process.env.FLIGHT_API_KEY,
          adults: number_of_adults || 1,
          children: number_of_children || 0,
          infants: number_of_infants || 0,
          origin: departure_airport_code,
          destination: arrival_airport_code,
          departureDate: departure_date,
          cabinClass: cabin_class?.toLowerCase() || 'economy',
          currency: currency || 'USD',
          market: region || 'US'
        },
        timeout: 5000 // 5 second timeout
      });
      
      console.log('Real API response received');
      return res.json(response.data);
    } catch (apiErr) {
      console.warn('API call failed, falling back to mock data:', apiErr.message);
      console.log('Using mock flight data as fallback');
      
      // Generate and return mock flight data
      const mockData = generateMockFlightData(
        departure_airport_code,
        arrival_airport_code,
        departure_date
      );
      
      return res.json(mockData);
    }
  } catch (err) {
    console.error('Error in flight search endpoint:', err);
    res.status(500).json({ 
      error: 'Failed to process flight search',
      message: err.message
    });
  }
});

// Add this new route handler for round-trip flights
router.get('/roundtrip', async (req, res) => {
  try {
    const {
      departure_airport_code,
      arrival_airport_code,
      departure_date,
      arrival_date,
      number_of_adults,
      number_of_childrens, // Note: this should be "children" to be consistent
      number_of_infants,
      cabin_class,
      currency,
      region
    } = req.query;

    // Validate required parameters
    if (!departure_airport_code || !arrival_airport_code || !departure_date || !arrival_date) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Searching for round-trip flights with params:', req.query);
    
    // Generate mock data for both outbound and return flights
    const outboundFlights = generateMockFlightData(
      departure_airport_code,
      arrival_airport_code,
      departure_date
    );
    
    const returnFlights = generateMockFlightData(
      arrival_airport_code,
      departure_airport_code,
      arrival_date
    );
    
    // Combine the results
    const mockRoundtripData = {
      success: true,
      currency: 'USD',
      outbound: outboundFlights.results,
      return: returnFlights.results
    };
    
    return res.json(mockRoundtripData);
  } catch (err) {
    console.error('Error in round-trip flight search:', err);
    res.status(500).json({ 
      error: 'Failed to process round-trip flight search',
      message: err.message
    });
  }
});

module.exports = router;