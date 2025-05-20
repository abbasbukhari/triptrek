const express = require('express');
const router = express.Router();

const canadianCities = [
  "Toronto (YYZ)", "Vancouver (YVR)", "Montreal (YUL)", "Calgary (YYC)", "Edmonton (YEG)", "Ottawa (YOW)", "Winnipeg (YWG)", "Halifax (YHZ)"
];

const majorCities = [
  "New York (JFK)", "London (LHR)", "Paris (CDG)", "Los Angeles (LAX)", "Tokyo (HND)", "Sydney (SYD)", "Dubai (DXB)", "Mexico City (MEX)"
];

const airlines = ['Air Canada', 'Delta', 'United', 'WestJet', 'American Airlines'];

function randomTime(startHour) {
  const hour = startHour + Math.floor(Math.random() * 5);
  const min = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

function randomPrice() {
  return (100 + Math.random() * 400).toFixed(2);
}

router.post('/', (req, res) => {
  const { from, to, date, returnDate, type } = req.body; // type: 'oneway' or 'return'
  const flights = Array.from({ length: 3 }).map((_, i) => {
    const depTime = randomTime(6 + i * 3);
    const arrTime = randomTime(9 + i * 3);
    const priceOneWay = randomPrice();
    let returnFlight = null;
    if (type === 'return' && returnDate) {
      const returnDepTime = randomTime(6 + i * 3);
      const returnArrTime = randomTime(9 + i * 3);
      returnFlight = {
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        flight_number: `AC${Math.floor(1000 + Math.random() * 9000)}`,
        from: to,
        to: from,
        date: returnDate,
        departure_time: returnDepTime,
        arrival_time: returnArrTime,
        price: randomPrice(),
      };
    }
    return {
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      flight_number: `AC${Math.floor(1000 + Math.random() * 9000)}`,
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
});

module.exports = router;