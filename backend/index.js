const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'terra_ser',
  password: 'yourpassword',
  port: 5432,
});

// Get influencers
app.get('/api/influencers', async (req, res) => {
  const result = await pool.query('SELECT * FROM influencers');
  res.json(result.rows);
});

// Match influencers
app.post('/api/match', async (req, res) => {
  const { niche } = req.body;
  const result = await pool.query('SELECT * FROM influencers WHERE niche=$1', [niche]);
  res.json(result.rows);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
