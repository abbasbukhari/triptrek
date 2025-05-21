import React, { useState } from 'react';
import './FlightSearch.css';

const FlightSearch = () => {
  const [tripType, setTripType] = useState('roundtrip');
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1 adult, Economy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flightData, setFlightData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fromAirport === toAirport) {
      setError('Departure and arrival airports must be different.');
      return;
    }
    setLoading(true);
    setError('');
    setFlightData(null);

    let url = '';
    if (tripType === 'oneway') {
      url = `/api/flights/oneway?departure_airport_code=${fromAirport}&arrival_airport_code=${toAirport}&departure_date=${departDate}&number_of_adults=1&number_of_children=0&number_of_infants=0&cabin_class=Economy&currency=USD&region=US`;
    } else {
      url = `/api/flights/roundtrip?departure_airport_code=${fromAirport}&arrival_airport_code=${toAirport}&departure_date=${departDate}&arrival_date=${returnDate}&number_of_adults=1&number_of_childrens=0&number_of_infants=0&cabin_class=Economy&currency=USD&region=US`;
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
    <div className="flight-search-container">
      <div className="trip-type-selector">
        <label className={tripType === 'roundtrip' ? 'active' : ''}>
          <input 
            type="radio" 
            value="roundtrip" 
            checked={tripType === 'roundtrip'}
            onChange={() => setTripType('roundtrip')}
          />
          Roundtrip
        </label>
        <label className={tripType === 'oneway' ? 'active' : ''}>
          <input 
            type="radio" 
            value="oneway" 
            checked={tripType === 'oneway'}
            onChange={() => setTripType('oneway')}
          />
          One Way
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="search-fields">
          <div className="search-field from">
            <label>From</label>
            <select 
              value={fromAirport} 
              onChange={(e) => setFromAirport(e.target.value)} 
              required
            >
              <option value="">Select airport</option>
              <option value="YYZ">Toronto (YYZ)</option>
              <option value="YVR">Vancouver (YVR)</option>
              <option value="JFK">New York (JFK)</option>
              <option value="LAX">Los Angeles (LAX)</option>
              <option value="LHR">London (LHR)</option>
            </select>
          </div>

          <div className="search-field to">
            <label>To</label>
            <select 
              value={toAirport} 
              onChange={(e) => setToAirport(e.target.value)} 
              required
            >
              <option value="">Select airport</option>
              <option value="YYZ">Toronto (YYZ)</option>
              <option value="YVR">Vancouver (YVR)</option>
              <option value="JFK">New York (JFK)</option>
              <option value="LAX">Los Angeles (LAX)</option>
              <option value="LHR">London (LHR)</option>
            </select>
          </div>

          <div className="search-field">
            <label>Depart</label>
            <input 
              type="date" 
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              required
            />
          </div>

          {tripType === 'roundtrip' && (
            <div className="search-field">
              <label>Return</label>
              <input 
                type="date" 
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
              />
            </div>
          )}

          <div className="search-field">
            <label>Travelers and cabin class</label>
            <input 
              type="text" 
              placeholder="1 adult, Economy"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="search-btn" disabled={loading}>
          {loading ? 'Searching...' : 'Search flights'}
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
};

export default FlightSearch;