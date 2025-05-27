import React, { useState } from 'react';
import './FlightSearch.css';

const FlightSearch = ({ onSelectFlight }) => {
  const [tripType, setTripType] = useState('roundtrip');
  const [fromAirport, setFromAirport] = useState('');
  const [toAirport, setToAirport] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1 adult, Economy');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flightData, setFlightData] = useState(null);
  const [searched, setSearched] = useState(false);

  // Update the handleSubmit function to correctly handle the API response
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
      url = `/api/flights/roundtrip?departure_airport_code=${fromAirport}&arrival_airport_code=${toAirport}&departure_date=${departDate}&arrival_date=${returnDate}&number_of_adults=1&number_of_children=0&number_of_infants=0&cabin_class=Economy&currency=USD&region=US`;
    }

    try {
      const res = await fetch(url);
      
      // Check if response is OK
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`API error: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Flight data received:', data);
      
      if (data.error) {
        setError(data.error);
      } else if ((data.results && data.results.length > 0) || 
                 (data.outbound && data.outbound.length > 0)) {
        setFlightData(data);
        setSearched(true);
      } else {
        setError('No flights found for this route.');
      }
    } catch (err) {
      console.error('Flight search error:', err);
      setError(`Failed to fetch flights: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const airportOptions = [
    { code: 'HEL', name: 'Helsinki Vantaa (HEL)' },
    { code: 'OUL', name: 'Oulu (OUL)' },
    { code: 'JFK', name: 'New York JFK (JFK)' },
    { code: 'LHR', name: 'London Heathrow (LHR)' },
  ];

  const handleSelectFlight = (flight) => {
    if (onSelectFlight) {
      onSelectFlight(flight);
    }
  };

  console.log('API Key being used:', import.meta.env.VITE_FLIGHT_API_KEY); // For client-side with Vite

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

      {/* Flight results display */}
      {!loading && flightData && (
        <div className="flight-results">
          {/* One-way flights */}
          {flightData.results && (
            <div className="flight-section">
              <h3>Available Flights</h3>
              <div className="flight-list">
                {flightData.results.map((flight) => (
                  <div key={flight.id} className="flight-card">
                    <div className="flight-header">
                      <span className="airline">{flight.airline}</span>
                      <span className="flight-number">{flight.flight_number}</span>
                    </div>
                    
                    <div className="flight-details">
                      <div className="departure">
                        <div className="time">{new Date(flight.departure.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="airport">{flight.departure.airport_code}</div>
                      </div>
                      
                      <div className="flight-duration">
                        <div className="duration">{flight.duration.hours}h {flight.duration.minutes}m</div>
                        <div className="line">————✈️————</div>
                      </div>
                      
                      <div className="arrival">
                        <div className="time">{new Date(flight.arrival.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="airport">{flight.arrival.airport_code}</div>
                      </div>
                    </div>
                    
                    <div className="flight-footer">
                      <div className="price">${flight.price.amount}</div>
                      <button 
                        className="select-flight-btn"
                        onClick={() => handleSelectFlight({
                          id: flight.id,
                          airline: flight.airline,
                          from: flight.departure.airport_code,
                          to: flight.arrival.airport_code,
                          price: `$${flight.price.amount}`,
                          flight_number: flight.flight_number
                        })}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Round-trip outbound flights */}
          {flightData.outbound && (
            <div className="flight-section">
              <h3>Outbound Flights</h3>
              <div className="flight-list">
                {flightData.outbound.map((flight) => (
                  <div key={flight.id} className="flight-card">
                    <div className="flight-header">
                      <span className="airline">{flight.airline}</span>
                      <span className="flight-number">{flight.flight_number}</span>
                    </div>
                    
                    <div className="flight-details">
                      <div className="departure">
                        <div className="time">{new Date(flight.departure.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="airport">{flight.departure.airport_code}</div>
                      </div>
                      
                      <div className="flight-duration">
                        <div className="duration">{flight.duration.hours}h {flight.duration.minutes}m</div>
                        <div className="line">————✈️————</div>
                      </div>
                      
                      <div className="arrival">
                        <div className="time">{new Date(flight.arrival.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="airport">{flight.arrival.airport_code}</div>
                      </div>
                    </div>
                    
                    <div className="flight-footer">
                      <div className="price">${flight.price.amount}</div>
                      <button 
                        className="select-flight-btn"
                        onClick={() => handleSelectFlight({
                          id: flight.id,
                          airline: flight.airline,
                          from: flight.departure.airport_code,
                          to: flight.arrival.airport_code,
                          price: `$${flight.price.amount}`,
                          flight_number: flight.flight_number,
                          type: 'outbound'
                        })}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Round-trip return flights */}
          {flightData.return && (
            <div className="flight-section">
              <h3>Return Flights</h3>
              <div className="flight-list">
                {flightData.return.map((flight) => (
                  <div key={flight.id} className="flight-card">
                    <div className="flight-header">
                      <span className="airline">{flight.airline}</span>
                      <span className="flight-number">{flight.flight_number}</span>
                    </div>
                    
                    <div className="flight-details">
                      <div className="departure">
                        <div className="time">{new Date(flight.departure.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="airport">{flight.departure.airport_code}</div>
                      </div>
                      
                      <div className="flight-duration">
                        <div className="duration">{flight.duration.hours}h {flight.duration.minutes}m</div>
                        <div className="line">————✈️————</div>
                      </div>
                      
                      <div className="arrival">
                        <div className="time">{new Date(flight.arrival.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="airport">{flight.arrival.airport_code}</div>
                      </div>
                    </div>
                    
                    <div className="flight-footer">
                      <div className="price">${flight.price.amount}</div>
                      <button 
                        className="select-flight-btn"
                        onClick={() => handleSelectFlight({
                          id: flight.id,
                          airline: flight.airline,
                          from: flight.departure.airport_code,
                          to: flight.arrival.airport_code,
                          price: `$${flight.price.amount}`,
                          flight_number: flight.flight_number,
                          type: 'return'
                        })}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;