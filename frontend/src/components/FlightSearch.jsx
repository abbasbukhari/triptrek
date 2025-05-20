import React, { useState } from 'react';

export default function FlightSearch() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [tripType, setTripType] = useState('oneway');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flightData, setFlightData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (from === to) {
      setError('Departure and arrival airports must be different.');
      return;
    }
    setLoading(true);
    setError('');
    setFlightData(null);

    let url = '';
    if (tripType === 'oneway') {
      url = `/api/flights/oneway?departure_airport_code=${from}&arrival_airport_code=${to}&departure_date=${date}&number_of_adults=1&number_of_children=0&number_of_infants=0&cabin_class=Economy&currency=USD&region=US`;
    } else {
      url = `/api/flights/roundtrip?departure_airport_code=${from}&arrival_airport_code=${to}&departure_date=${date}&arrival_date=${returnDate}&number_of_adults=1&number_of_childrens=0&number_of_infants=0&cabin_class=Economy&currency=USD&region=US`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || 'No flights found or API error.');
      } else if (data.itineraries && data.itineraries.length > 0) {
        setFlightData(data);
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
  ];

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              value="oneway"
              checked={tripType === 'oneway'}
              onChange={() => setTripType('oneway')}
            />
            One Way
          </label>
          <label>
            <input
              type="radio"
              value="roundtrip"
              checked={tripType === 'roundtrip'}
              onChange={() => setTripType('roundtrip')}
            />
            Round Trip
          </label>
        </div>
        <select value={from} onChange={e => setFrom(e.target.value)} required>
          <option value="">From (Select Airport)</option>
          {airportOptions.map(opt => (
            <option key={opt.code} value={opt.code}>{opt.name}</option>
          ))}
        </select>
        <select value={to} onChange={e => setTo(e.target.value)} required>
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
        {tripType === 'roundtrip' && (
          <input
            type="date"
            value={returnDate}
            onChange={e => setReturnDate(e.target.value)}
            required
            min={date}
            placeholder="Return Date"
          />
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {flightData?.itineraries?.slice(0, 3).map((itinerary) => (
          <li key={itinerary.id} style={{ marginBottom: '1em', border: '1px solid #ccc', padding: '1em' }}>
            {itinerary.leg_ids.map((legId, idx) => {
              const leg = flightData.legs && flightData.legs.find(l => l.id === legId);
              if (!leg) return null;

              const origin = flightData.places && flightData.places.find(p => p.id === leg.origin_place_id);
              const destination = flightData.places && flightData.places.find(p => p.id === leg.destination_place_id);

              // Get segment for flight number and carrier
              const segment = flightData.segments && leg.segment_ids && flightData.segments.find(s => s.id === leg.segment_ids[0]);
              const carrier = flightData.carriers && segment && flightData.carriers.find(c => c.id === segment.marketing_carrier_id);

              // Format times
              const departureLocal = leg.departure
                ? new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: origin?.timezone || 'UTC'
                  }).format(new Date(leg.departure))
                : "N/A";
              const arrivalLocal = leg.arrival
                ? new Intl.DateTimeFormat('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: destination?.timezone || 'UTC'
                  }).format(new Date(leg.arrival))
                : "N/A";

              // Duration in hours/minutes
              const durationH = Math.floor((leg.duration || 0) / 60);
              const durationM = (leg.duration || 0) % 60;

              return (
                <div key={legId} style={{ marginBottom: '0.5em' }}>
                  <strong>{idx === 0 ? 'Outbound' : 'Return'} Flight:</strong><br />
                  <strong>Departure:</strong> {departureLocal} {origin ? `(${origin.name})` : ''}<br />
                  <strong>Arrival:</strong> {arrivalLocal} {destination ? `(${destination.name})` : ''}<br />
                  <strong>Airline:</strong> {carrier ? carrier.name : "N/A"}<br />
                  <strong>Flight Number:</strong> {segment ? segment.marketing_flight_number : "N/A"}<br />
                  <strong>Stops:</strong> {typeof leg.stop_count === 'number' ? leg.stop_count : "N/A"}<br />
                  <strong>Duration:</strong> {leg.duration ? `${durationH}h ${durationM}m` : "N/A"}<br />
                </div>
              );
            })}
            <strong>Price:</strong>{" "}
            {itinerary.pricing_options && itinerary.pricing_options[0]
              ? `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(itinerary.pricing_options[0].price.amount)}`
              : "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}