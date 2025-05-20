import React, { useState } from 'react';

export default function FlightSearch() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (from === to) {
      setError('Departure and arrival airports must be different.');
      return;
    }
    setLoading(true);
    setError('');
    setFlights([]);
    try {
      const res = await fetch(
        `/api/flights/oneway?departure_airport_code=${from}&arrival_airport_code=${to}&departure_date=${date}&number_of_adults=1&number_of_children=0&number_of_infants=0&cabin_class=Economy&currency=USD&region=US`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || 'No flights found or API error.');
      } else if (data.itineraries && data.itineraries.length > 0) {
        setFlights(data.itineraries);
      } else {
        setError('No flights found.');
      }
    } catch (err) {
      setError('Failed to fetch flights: ' + err.message);
    }
    setLoading(false);
  };

  const airportOptions = [
    { code: 'HEL', name: 'Helsinki Vantaa (HEL)' },
    { code: 'OUL', name: 'Oulu (OUL)' },
    { code: 'JFK', name: 'New York JFK (JFK)' },
    { code: 'LHR', name: 'London Heathrow (LHR)' },
    // Add more airports as needed
  ];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select
          value={from}
          onChange={e => setFrom(e.target.value)}
          required
        >
          <option value="">From (Select Airport)</option>
          {airportOptions.map(opt => (
            <option key={opt.code} value={opt.code}>{opt.name}</option>
          ))}
        </select>
        <select
          value={to}
          onChange={e => setTo(e.target.value)}
          required
        >
          <option value="">To (Select Airport)</option>
          {airportOptions.map(opt => (
            <option key={opt.code} value={opt.code}>{opt.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <ul>
        {flights.slice(0, 3).map(flight => {
          // Try to get the first segment if it exists
          const segment = flight.segments && flight.segments[0];
          return (
            <li key={flight.id} style={{marginBottom: '1em', border: '1px solid #ccc', padding: '1em'}}>
              <strong>Departure:</strong>{" "}
              {segment && segment.departure_time
                ? new Date(segment.departure_time).toLocaleString()
                : "N/A"} <br />
              <strong>Arrival:</strong>{" "}
              {segment && segment.arrival_time
                ? new Date(segment.arrival_time).toLocaleString()
                : "N/A"} <br />
              <strong>Price:</strong>{" "}
              {flight.pricing_options && flight.pricing_options[0]
                ? `${flight.pricing_options[0].price.amount} USD`
                : "N/A"}
            </li>
          );
        })}
      </ul>
    </div>
  );
}