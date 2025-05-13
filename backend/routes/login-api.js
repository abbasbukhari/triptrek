const express = require('express');
const router = express.Router();

// Dummy credentials for demonstration
const DUMMY_USER = {
  username: 'testuser',
  password: 'testpass'
};

router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
    return res.json({ success: true, message: 'Login successful' });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

module.exports = router;