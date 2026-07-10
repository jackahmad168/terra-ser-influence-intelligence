const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

// Influencer profiles (later connect to PostgreSQL)
const influencers = [
  { id: 1, name: 'FoodieKL', followers: 120000, niche: 'F&B', engagementRate: 8.2 },
  { id: 2, name: 'BeautyGlow', followers: 95000, niche: 'Beauty', engagementRate: 10.1 }
];

// Get all influencers
app.get('/api/influencers', (req, res) => res.json(influencers));

// Match influencers to campaign
app.post('/api/match', (req, res) => {
  const { niche } = req.body;
  const matched = influencers.filter((i) => i.niche === niche);
  res.json({ matched });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
