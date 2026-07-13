const express = require('express');
const pool = require('../models/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get user's campaigns
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create campaign
router.post('/', verifyToken, async (req, res) => {
  const { title, niche, budget } = req.body;

  if (!title || !niche) {
    return res.status(400).json({ error: 'Title and niche required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO campaigns (user_id, title, niche, budget) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, niche, budget || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update campaign
router.put('/:id', verifyToken, async (req, res) => {
  const { title, niche, budget, status } = req.body;

  try {
    const campaign = await pool.query(
      'SELECT * FROM campaigns WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (campaign.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const result = await pool.query(
      'UPDATE campaigns SET title = $1, niche = $2, budget = $3, status = $4 WHERE id = $5 RETURNING *',
      [title || campaign.rows[0].title, niche || campaign.rows[0].niche, budget || campaign.rows[0].budget, status || campaign.rows[0].status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete campaign
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const campaign = await pool.query(
      'SELECT * FROM campaigns WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (campaign.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    await pool.query('DELETE FROM campaigns WHERE id = $1', [req.params.id]);
    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
