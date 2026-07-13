const express = require('express');
const cors = require('cors');
const pool = require('./models/db');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('DATABASE_URL configured:', Boolean(process.env.DATABASE_URL));

app.use(cors());
app.use(express.json());

const fallbackInfluencers = [
  { id: 1, name: 'FoodieKL', followers: 120000, niche: 'F&B', engagementRate: 8.2 },
  { id: 2, name: 'BeautyGlow', followers: 95000, niche: 'Beauty', engagementRate: 10.1 }
];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/influencers', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM influencers');
    return res.json(result.rows);
  } catch (error) {
    console.error('Database query failed:', error.message);
    return res.status(500).json({ error: 'Unable to fetch influencers' });
  }
});

app.post('/api/match', async (req, res) => {
  const niche = (req.body?.niche || '').trim();

  try {
    const result = await pool.query(
      'SELECT id, name, niche, followers, engagement_rate AS "engagementRate" FROM influencers WHERE LOWER(niche) = LOWER($1) ORDER BY followers DESC',
      [niche]
    );

    if (result.rows.length > 0) {
      return res.json({ matched: result.rows });
    }
  } catch (error) {
    console.error('Match query failed, using fallback data:', error.message);
  }

  const matched = fallbackInfluencers.filter((influencer) => influencer.niche.toLowerCase() === niche.toLowerCase());
  return res.json({ matched });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
