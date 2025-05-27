import React from 'react';
import './FlightResults.css';

const FlightResults = ({ flights, type, onSelect }) => {
  return (
    <div className="flight-results-container">
      <h2 className="flight-results-title">{type} Flights</h2>
      
      <div className="flight-results-list">
        {flights.map((flight, index) => (
          <div key={index} className="flight-card">
            <div className="flight-card-body">
              <div className="flight-airline">
                <span className="airline-name">{flight.airline}</span>
                <span className="flight-number">{flight.flightNumber}</span>
              </div>
              
              <div className="flight-details">
                <div className="flight-time">
                  <div className="time-large">{flight.departureTime}</div>
                  <div className="airport-code">{flight.departureAirport}</div>
                </div>
                
                <div className="flight-duration">
                  <div className="duration">{flight.duration}</div>
                  <div className="flight-path">
                    <span className="flight-line"></span>
                    <span className="flight-icon">✈️</span>
                  </div>
                </div>
                
                <div className="flight-time">
                  <div className="time-large">{flight.arrivalTime}</div>
                  <div className="airport-code">{flight.arrivalAirport}</div>
                </div>
              </div>
            </div>
            
            <div className="flight-card-side">
              <div className="flight-price">${flight.price}</div>
              <button 
                className="select-flight-btn" 
                onClick={() => onSelect(flight)}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightResults;