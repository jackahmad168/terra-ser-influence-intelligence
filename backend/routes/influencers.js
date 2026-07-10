const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// Get influencers
router.get('/influencers', async (req, res) => {
  const result = await pool.query('SELECT * FROM influencers');
  res.json(result.rows);
});

// Match influencers
router.post('/match', async (req, res) => {
  const { niche } = req.body;
  const result = await pool.query('SELECT * FROM influencers WHERE niche=$1', [niche]);
  res.json(result.rows);
});

module.exports = router;
