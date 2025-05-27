import React, { useState, useEffect } from 'react';
import './TravelBundle.css';

const TravelBundle = ({ selectedFlight, selectedHotel, duration }) => {
  const [bundlePrice, setBundlePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedFlight && selectedHotel) {
      calculateBundle();
    }
  }, [selectedFlight, selectedHotel, duration]);

  const calculateBundle = () => {
    setLoading(true);
    setError('');
    
    try {
      // Get base prices
      let flightPrice = 0;
      if (typeof selectedFlight.price === 'string') {
        // Handle "$199" format
        flightPrice = parseFloat(selectedFlight.price.replace(/[^0-9.]/g, ''));
      } else if (selectedFlight.pricing_options && selectedFlight.pricing_options[0]?.price?.amount) {
        // Handle API response format
        flightPrice = selectedFlight.pricing_options[0].price.amount;
      }

      let hotelPrice = 0;
      if (typeof selectedHotel.price === 'string') {
        // Handle "$199" format
        hotelPrice = parseFloat(selectedHotel.price.replace(/[^0-9.]/g, ''));
      } else {
        hotelPrice = parseFloat(selectedHotel.price || 0);
      }

      // Calculate total hotel price for the entire duration
      const totalHotelPrice = hotelPrice * (duration || 1);
      
      // Apply bundle discount (10% off total)
      const totalBeforeDiscount = flightPrice + totalHotelPrice;
      const discountAmount = totalBeforeDiscount * 0.1;
      const finalPrice = totalBeforeDiscount - discountAmount;
      
      setBundlePrice(finalPrice);
      setDiscount(discountAmount);
      
    } catch (err) {
      console.error('Error calculating bundle:', err);
      setError('Could not calculate bundle price');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedFlight || !selectedHotel) {
    return null;
  }

  return (
    <div className="bundle-container">
      <h2>Travel Bundle</h2>
      
      <div className="bundle-details">
        <div className="bundle-item flight">
          <h3>Flight</h3>
          <p>
            <strong>{selectedFlight.airline || 'Flight'}</strong>
            {selectedFlight.flight_number && ` (${selectedFlight.flight_number})`}
          </p>
          <p>
            {selectedFlight.from && selectedFlight.to 
              ? `${selectedFlight.from} → ${selectedFlight.to}` 
              : 'Selected flight'}
          </p>
          <p className="price">
            {typeof selectedFlight.price === 'string' 
              ? selectedFlight.price 
              : selectedFlight.pricing_options && selectedFlight.pricing_options[0] 
                ? `$${selectedFlight.pricing_options[0].price.amount.toFixed(2)}` 
                : 'Price not available'}
          </p>
        </div>
        
        <div className="bundle-item hotel">
          <h3>Hotel</h3>
          <p><strong>{selectedHotel.name}</strong></p>
          <p>{selectedHotel.location}</p>
          <p className="price">
            {selectedHotel.price} × {duration || 1} {duration === 1 ? 'night' : 'nights'}
            <span className="total-price">
              = ${(parseFloat(selectedHotel.price.replace(/[^0-9.]/g, '')) * (duration || 1)).toFixed(2)}
            </span>
          </p>
        </div>
      </div>
      
      <div className="bundle-summary">
        <div className="summary-row">
          <span>Total before discount:</span>
          <span>${bundlePrice + discount > 0 ? (bundlePrice + discount).toFixed(2) : '0.00'}</span>
        </div>
        <div className="summary-row discount">
          <span>Bundle discount (10%):</span>
          <span>-${discount.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Bundle price:</span>
          <span>${bundlePrice.toFixed(2)}</span>
        </div>
        
        <button className="book-bundle-btn" disabled={loading}>
          {loading ? 'Calculating...' : 'Book Bundle'}
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default TravelBundle;