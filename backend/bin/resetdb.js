// backend/bin/resetdb.js
// #!/usr/bin/env node

// load .env data into process.env
require('dotenv').config();

// other dependencies
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const db = require('../db/connection');

// PG connection setup
// const connectionString = process.env.DATABASE_URL ||
//   `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=disable`;
// const client = new Client();

// Function to read and execute SQL files
const runSchemaFiles = async () => {
  console.log(chalk.cyan(`-> Loading Schema Files ...`));
  const schemaDir = path.join(__dirname, '../db/schema');
  const schemaFiles = fs.readdirSync(schemaDir).sort();

  for (const file of schemaFiles) {
    if (file.endsWith('.sql')) {
      const sql = fs.readFileSync(path.join(schemaDir, file), 'utf8');
      console.log(`\t-> Running ${chalk.green(file)}`);
      await db.query(sql);
    }
  }
};

// Function to read and execute seed files
const runSeedFiles = async () => {
  console.log(chalk.cyan(`-> Loading Seeds ...`));
  const seedDir = path.join(__dirname, '../db/seeds');
  const seedFiles = fs.readdirSync(seedDir).sort();

  for (const file of seedFiles) {
    if (file.endsWith('.sql')) {
      const sql = fs.readFileSync(path.join(seedDir, file), 'utf8');
      console.log(`\t-> Running ${chalk.green(file)}`);
      await db.query(sql);
    }
  }
};

// Main function to reset the database
const resetDatabase = async () => {
  try {
    process.env.DB_HOST &&
      console.log(`-> Connecting to PG on ${process.env.DB_HOST} as ${process.env.DB_USER}...`);

    await runSchemaFiles();
    await runSeedFiles();
    console.log('Database reset successful!');
  } catch (err) {
    console.error(chalk.red(`Failed due to error: ${err.message}`));
  } finally {
    // Close the pool
    process.exit();
  }
};

resetDatabase();
