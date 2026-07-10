const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(connectionString ? { connectionString } : {
  user: 'postgres',
  host: 'localhost',
  database: 'terra_ser',
  password: 'yourpassword',
  port: 5432,
});

module.exports = pool;
