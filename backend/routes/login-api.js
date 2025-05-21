const express = require('express');
const router = express.Router();
const userQueries = require('../db/queries/users');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username and password are required' 
    });
  }
  
  try {
    console.log(`Login attempt for username: ${username}`);
    
    const user = await userQueries.verifyUser(username, password);
    
    if (user) {
      console.log(`User found, login successful for: ${username}`);
      // Return user ID and relevant info for session storage
      return res.json({
        success: true,
        message: 'Login successful',
        userId: user.id,
        username: user.username
      });
    }
    
    console.log(`Invalid credentials for username: ${username}`);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
    
  } catch (err) {
    console.error('Login error details:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

module.exports = router;