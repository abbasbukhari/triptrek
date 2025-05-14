import React, { useState } from 'react';

const canadianCities = [
  "Toronto (YYZ)", "Vancouver (YVR)", "Montreal (YUL)", "Calgary (YYC)", "Edmonton (YEG)", "Ottawa (YOW)", "Winnipeg (YWG)", "Halifax (YHZ)"
];
const majorCities = [
  "New York (JFK)", "London (LHR)", "Paris (CDG)", "Los Angeles (LAX)", "Tokyo (HND)", "Sydney (SYD)", "Dubai (DXB)", "Mexico City (MEX)"
];

export default function FlightSearch() {
  const [from, setFrom] = useState(canadianCities[0]);
  const [to, setTo] = useState(majorCities[0]);
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [type, setType] = useState('oneway');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFlights([]);
    try {
      const res = await fetch('http://localhost:8080/api/flights-sim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, date, returnDate, type }),
      });
      const data = await res.json();
      setFlights(data.flights || []);
    } catch (err) {
      setError('Failed to fetch flights');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Flight Search</h2>
      <form onSubmit={handleSubmit}>
        <label>
          From:
          <select value={from} onChange={e => setFrom(e.target.value)}>
            {canadianCities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </label>
        <label>
          To:
          <select value={to} onChange={e => setTo(e.target.value)}>
            {majorCities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </label>
        <label>
          Departure Date:
          <input value={date} onChange={e => setDate(e.target.value)} type="date" required />
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="oneway"
            checked={type === 'oneway'}
            onChange={() => setType('oneway')}
          /> One Way
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="return"
            checked={type === 'return'}
            onChange={() => setType('return')}
          /> Return
        </label>
        {type === 'return' && (
          <label>
            Return Date:
            <input value={returnDate} onChange={e => setReturnDate(e.target.value)} type="date" required />
          </label>
        )}
        <button type="submit" disabled={loading}>Search</button>
      </form>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <ul>
        {flights.map((flight, idx) => (
          <li key={idx}>
            <b>{flight.airline}</b> {flight.flight_number} | {flight.from} → {flight.to} | {flight.departure_time} - {flight.arrival_time} | ${flight.price}
            {flight.returnFlight && (
              <div>
                <b>Return:</b> {flight.returnFlight.airline} {flight.returnFlight.flight_number} | {flight.returnFlight.from} → {flight.returnFlight.to} | {flight.returnFlight.departure_time} - {flight.returnFlight.arrival_time} | ${flight.returnFlight.price}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}