const express = require('express');
const router = express.Router();

router.post('/calculate', (req, res) => {
  const { flightPrice, hotelPrice, nights, destination } = req.body;
  
  if (!flightPrice || !hotelPrice || !nights) {
    return res.status(400).json({ 
      error: 'Missing required parameters' 
    });
  }
  
  try {
    const totalHotelPrice = hotelPrice * nights;
    const totalBeforeDiscount = flightPrice + totalHotelPrice;
    
    // Dynamic discount based on destination or season
    let discountRate = 0.1; // Default 10%
    
    // Enhance discount for certain destinations or longer stays
    if (nights >= 7) {
      discountRate = 0.15; // 15% for longer stays
    }
    
    if (['Paris', 'Rome', 'Barcelona'].includes(destination)) {
      discountRate += 0.05; // Additional 5% for popular destinations
    }
    
    const discountAmount = totalBeforeDiscount * discountRate;
    const finalPrice = totalBeforeDiscount - discountAmount;
    
    res.json({
      originalFlightPrice: flightPrice,
      originalHotelPrice: hotelPrice,
      nightsStay: nights,
      totalBeforeDiscount,
      discountRate,
      discountAmount,
      finalPrice
    });
    
  } catch (err) {
    res.status(500).json({ 
      error: 'Error calculating bundle price' 
    });
  }
});

module.exports = router;