// flights code

exports.seed = async function(knex) {
  // Will delete all existing entries
  await knex('flights').del();
  
  // To add seed entries
  await knex('flights').insert([
    {
      id: 1,
      airline: 'Air Canada',
      flight_number: 'AC123',
      from_airport: 'YYZ',
      to_airport: 'JFK',
      departure_date: '2025-06-01',
      departure_time: '09:00:00',
      arrival_time: '11:00:00',
      price: 299.99
    },
    {
      id: 2,
      airline: 'Delta',
      flight_number: 'DL456',
      from_airport: 'JFK',
      to_airport: 'LAX',
      departure_date: '2025-06-05',
      departure_time: '10:30:00',
      arrival_time: '13:45:00',
      price: 349.99
    },
    {
      id: 3,
      airline: 'United',
      flight_number: 'UA789',
      from_airport: 'LAX',
      to_airport: 'YVR',
      departure_date: '2025-06-10',
      departure_time: '14:15:00',
      arrival_time: '17:30:00',
      price: 279.99
    },
    {
      id: 4,
      airline: 'WestJet',
      flight_number: 'WJ234',
      from_airport: 'YVR',
      to_airport: 'YYZ',
      departure_date: '2025-06-15',
      departure_time: '11:45:00',
      arrival_time: '19:20:00',
      price: 319.99
    },
    {
      id: 5,
      airline: 'American Airlines',
      flight_number: 'AA567',
      from_airport: 'YYZ',
      to_airport: 'LHR',
      departure_date: '2025-06-20',
      departure_time: '20:00:00',
      arrival_time: '08:30:00',
      price: 599.99
    }
  ]);
};

// user schema for flights
exports.up = function(knex) {
  return knex.schema.createTable('flights', function(table) {
    table.increments('id').primary();
    table.string('airline').notNullable();
    table.string('flight_number').notNullable();
    table.string('from_airport').notNullable();
    table.string('to_airport').notNullable();
    table.date('departure_date').notNullable();
    table.time('departure_time').notNullable();
    table.time('arrival_time').notNullable();
    table.decimal('price', 10, 2).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('flights');
};