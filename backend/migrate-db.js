const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = process.env.DATABASE_URL || 'postgresql://backend_r95t_user:VoINh0mdA6y5092FPuqzPjEfobvCg9rb@dpg-d98aska8qa3s73f6lhdg-a.singapore-postgres.render.com/backend_r95t';

async function migrateDatabase() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('Connected to database');

    // Drop existing tables to recreate with full schema
    await client.query('DROP TABLE IF EXISTS campaigns');
    await client.query('DROP TABLE IF EXISTS users');
    await client.query('DROP TABLE IF EXISTS influencers');
    console.log('Dropped existing tables');

    // Create influencers table
    await client.query(`
      CREATE TABLE influencers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        niche VARCHAR(50),
        followers INT,
        engagement_rate FLOAT
      )
    `);
    console.log('Created influencers table');

    // Create users table
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Created users table');

    // Create campaigns table
    await client.query(`
      CREATE TABLE campaigns (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255),
        niche VARCHAR(50),
        budget DECIMAL(10, 2),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Created campaigns table');

    // Insert influencers data
    await client.query(`
      INSERT INTO influencers (name, niche, followers, engagement_rate)
      VALUES ('FoodieKL', 'F&B', 120000, 8.2),
             ('BeautyGlow', 'Beauty', 95000, 10.1)
    `);
    console.log('Inserted influencers data');

    // Insert demo user with bcrypt hashed password
    await client.query(`
      INSERT INTO users (email, password, name)
      VALUES ($1, $2, $3)
    `, ['demo@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye9tMQy7E/u9mw2xGYAuJEZHXfb9k6h2G', 'Demo User']);
    console.log('Inserted demo user');

    const result = {
      ok: true,
      message: 'Database migrated successfully',
      tables: ['influencers', 'users', 'campaigns'],
      seedData: { influencers: 2, users: 1 }
    };

    fs.writeFileSync('./migration-result.json', JSON.stringify(result, null, 2));
    console.log('Migration complete!');

  } catch (error) {
    const result = { ok: false, error: error.message };
    fs.writeFileSync('./migration-result.json', JSON.stringify(result, null, 2));
    console.error('Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  migrateDatabase();
}

module.exports = migrateDatabase;
