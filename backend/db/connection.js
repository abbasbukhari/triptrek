// PG database client/connection setup
const { Pool } = require('pg');

// Get connection parameters from environment variables with fallbacks
const dbParams = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '', // Make sure this is set correctly in .env
  database: process.env.DB_NAME || 'triptrek',
};

console.log('Database connection parameters:', {
  host: dbParams.host,
  port: dbParams.port,
  user: dbParams.user,
  database: dbParams.database,
  // Don't log the password for security
});

const pool = new Pool(dbParams);

// Test the connection
pool.query('SELECT NOW()')
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));

module.exports = {
  query: (text, params) => pool.query(text, params)
};
