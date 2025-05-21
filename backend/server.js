// Load .env file
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

// Middleware
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(cors());         // Enable CORS

// Import route modules
const loginApi = require('./routes/login-api');

// Mount all resource routes
app.use('/api/login', loginApi);

// Sample route to test server
app.get('/', (req, res) => {
  res.json({ message: "Welcome to TripTrek API!" });
});

// Start listening for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`TripTrek API listening on port ${PORT}`);
});