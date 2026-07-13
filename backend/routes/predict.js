const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();
const AI_SCRIPT_PATH = path.join(__dirname, '../../ai/predict.py');

/**
 * Predict campaign performance using ML model
 * POST /api/predict/campaign
 * Body: { influencer_id, campaign_id } OR { followers, engagement_rate, budget, niche }
 */
router.post('/campaign', verifyToken, async (req, res) => {
  try {
    const { influencer_id, campaign_id, followers, engagement_rate, budget, niche } = req.body;
    
    let predictionInput = { followers, engagement_rate, budget, niche };
    
    // If influencer_id and campaign_id provided, fetch from database
    if (influencer_id && campaign_id) {
      const pool = require('../models/db');
      
      const influencerResult = await pool.query('SELECT followers, engagement_rate FROM influencers WHERE id = $1', [influencer_id]);
      const campaignResult = await pool.query('SELECT budget, niche FROM campaigns WHERE id = $1 AND user_id = $2', [campaign_id, req.user.id]);
      
      if (!influencerResult.rows[0] || !campaignResult.rows[0]) {
        return res.status(404).json({ error: 'Influencer or campaign not found' });
      }
      
      const influencer = influencerResult.rows[0];
      const campaign = campaignResult.rows[0];
      
      predictionInput = {
        followers: influencer.followers,
        engagement_rate: influencer.engagement_rate,
        budget: campaign.budget,
        niche: campaign.niche
      };
    }
    
    // Validate input
    if (!predictionInput.followers || !predictionInput.engagement_rate || 
        !predictionInput.budget || !predictionInput.niche) {
      return res.status(400).json({ error: 'Missing required fields: followers, engagement_rate, budget, niche' });
    }
    
    // Call Python prediction script
    const prediction = await runPythonPrediction(
      predictionInput.followers,
      predictionInput.engagement_rate,
      predictionInput.budget,
      predictionInput.niche
    );
    
    if (!prediction.success && prediction.error) {
      return res.status(500).json({ error: prediction.error });
    }
    
    res.json(prediction);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Run Python prediction script
 */
function runPythonPrediction(followers, engagement, budget, niche) {
  return new Promise((resolve) => {
    const python = spawn('python3', [
      AI_SCRIPT_PATH,
      String(followers),
      String(engagement),
      String(budget),
      String(niche)
    ]);
    
    let output = '';
    let errorOutput = '';
    
    python.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    python.on('close', (code) => {
      try {
        if (code === 0 && output) {
          const result = JSON.parse(output);
          resolve(result);
        } else {
          resolve({
            success: false,
            error: errorOutput || 'Prediction failed',
            predicted_roi: 0,
            confidence: 0
          });
        }
      } catch (e) {
        resolve({
          success: false,
          error: 'Failed to parse prediction output',
          predicted_roi: 0,
          confidence: 0
        });
      }
    });
  });
}

module.exports = router;
