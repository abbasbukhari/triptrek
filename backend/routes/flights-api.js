const express = require('express');
const router = express.Router();
const axios = require('axios');

const FLIGHT_API_KEY = process.env.FLIGHT_API_KEY;

router.get('/test', (req, res) => {
  res.json({ message: 'Flights API is working!' });
});

router.get('/oneway', async (req, res) => {
  const {
    departure_airport_code,
    arrival_airport_code,
    departure_date,
    number_of_adults,
    number_of_children, // <-- change here
    number_of_infants,
    cabin_class,
    currency,
    region
  } = req.query;

  if (
    !departure_airport_code || !arrival_airport_code || !departure_date ||
    !number_of_adults || !number_of_children || !number_of_infants ||
    !cabin_class || !currency || !region
  ) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const apiUrl = `https://api.flightapi.io/onewaytrip/${FLIGHT_API_KEY}/${departure_airport_code}/${arrival_airport_code}/${departure_date}/${number_of_adults}/${number_of_children}/${number_of_infants}/${cabin_class}/${currency}`;

  try {
    const response = await axios.get(apiUrl, { params: { region } });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Flight API error:', error.response.status, error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      console.error('Flight API error:', error.message);
      res.status(500).json({ error: 'Failed to fetch flight data' });
    }
  }
});

router.get('/roundtrip', async (req, res) => {
  const {
    departure_airport_code,
    arrival_airport_code,
    departure_date,
    arrival_date,
    number_of_adults,
    number_of_childrens,
    number_of_infants,
    cabin_class,
    currency,
    region
  } = req.query;

  if (
    !departure_airport_code || !arrival_airport_code || !departure_date || !arrival_date ||
    !number_of_adults || !number_of_childrens || !number_of_infants ||
    !cabin_class || !currency || !region
  ) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const apiUrl = `https://api.flightapi.io/roundtrip/${FLIGHT_API_KEY}/${departure_airport_code}/${arrival_airport_code}/${departure_date}/${arrival_date}/${number_of_adults}/${number_of_childrens}/${number_of_infants}/${cabin_class}/${currency}`;

  try {
    const response = await axios.get(apiUrl, { params: { region } });
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Flight API error:', error.response.status, error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

module.exports = router;