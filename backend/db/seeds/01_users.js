// 01_users code

const bcrypt = require('bcrypt');
const saltRounds = 10;

// sample hashed password
const hashedPassword = '$2b$10$vQWHtKSIkJ0GHjZTIk9x.OPVrQj9Mzk36I3HbxgZfFQJmwwJK9XpO';

exports.seed = async function(knex) {
  // Remove all existing entries
  await knex('users').del();
  
  // Put in seed entries
  await knex('users').insert([
    {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword, // password123
      role: 'user'
    },
    {
      id: 2, 
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword, // password123
      role: 'admin'
    },
    {
      id: 3,
      username: 'traveler1',
      email: 'traveler1@example.com',
      password: hashedPassword, // password123
      role: 'user'
    }
  ]);
};

// User schema for user table
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('username').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('role').defaultTo('user');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};