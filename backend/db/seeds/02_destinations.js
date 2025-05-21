// code for destinations




exports.seed = async function(knex) {
  // Will delete all existing entries
  await knex('destinations').del();
  
  // Insert seed entries
  await knex('destinations').insert([
    {
      id: 1,
      city: 'Paris',
      country: 'France',
      description: 'The city of lights and love.',
      deal: '20% off flights',
      lat: 48.8566,
      lng: 2.3522
    },
    {
      id: 2,
      city: 'Tokyo',
      country: 'Japan',
      description: 'A bustling hub of culture and technology.',
      deal: '15% off hotels',
      lat: 35.6895,
      lng: 139.6917
    },
    {
      id: 3,
      city: 'New York',
      country: 'USA',
      description: 'The city that never sleeps.',
      deal: '10% off attractions',
      lat: 40.7128,
      lng: -74.0060
    },
    {
      id: 4,
      city: 'Hong Kong',
      country: 'China',
      description: 'Visit Hong Kong',
      deal: '25% off flights',
      lat: 22.3193,
      lng: 114.1694
    },
    {
      id: 5,
      city: 'Toronto',
      country: 'Canada',
      description: 'Visit Toronto.',
      deal: '30% off flights',
      lat: 43.651070,
      lng: -79.347015
    }
  ]);
};

// user schema for destinations and flights
exports.up = function(knex) {
  return knex.schema.createTable('destinations', function(table) {
    table.increments('id').primary();
    table.string('city').notNullable();
    table.string('country').notNullable();
    table.text('description');
    table.string('deal');
    table.float('lat');
    table.float('lng');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('destinations');
};