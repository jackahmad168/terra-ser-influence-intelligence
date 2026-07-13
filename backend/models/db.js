const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://backend_r95t_user:VoINh0mdA6y5092FPuqzPjEfobvCg9rb@dpg-d98aska8qa3s73f6lhdg-a.singapore-postgres.render.com/backend_r95t',
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
