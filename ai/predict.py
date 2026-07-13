#!/usr/bin/env python3
"""
ML model for predicting influencer campaign performance.
Predicts campaign success metrics based on influencer profile and campaign details.
"""

import json
import sys
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

# Initialize model and scaler
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'campaign_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'scaler.pkl')

def train_model():
    """Train a Random Forest model on synthetic influencer campaign data."""
    # Synthetic training data: [followers, engagement_rate, budget, niche_encoded]
    X_train = np.array([
        [120000, 8.2, 5000, 1],    # FoodieKL
        [95000, 10.1, 3000, 2],    # BeautyGlow
        [250000, 7.5, 8000, 1],    # High followers, food
        [180000, 9.2, 6000, 2],    # Medium followers, beauty
        [350000, 6.8, 10000, 3],   # Very high followers, fashion
        [80000, 11.3, 2500, 2],    # Lower followers, high engagement
        [500000, 5.2, 15000, 3],   # Mega influencer
        [150000, 8.9, 4500, 1],    # Mid-tier food
    ])
    
    # Target: Expected campaign ROI (return on investment %)
    y_train = np.array([45, 52, 38, 48, 35, 58, 28, 50])
    
    # Train model
    model = RandomForestRegressor(n_estimators=50, random_state=42, max_depth=10)
    model.fit(X_train, y_train)
    
    # Train scaler
    scaler = StandardScaler()
    scaler.fit(X_train)
    
    # Save model and scaler
    joblib.dump(model, MODEL_PATH)
    joblib.dump(scaler, SCALER_PATH)
    
    return model, scaler

def load_or_train_model():
    """Load existing model or train new one."""
    if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
    else:
        model, scaler = train_model()
    return model, scaler

def encode_niche(niche):
    """Encode niche category to numeric value."""
    niche_map = {
        'F&B': 1,
        'Beauty': 2,
        'Fashion': 3,
        'Tech': 4,
        'Travel': 5,
        'Fitness': 6,
        'Other': 0
    }
    return niche_map.get(niche, 0)

def predict_campaign_performance(influencer_followers, influencer_engagement, 
                                  campaign_budget, campaign_niche):
    """
    Predict campaign ROI based on influencer and campaign data.
    
    Args:
        influencer_followers: Number of followers (int)
        influencer_engagement: Engagement rate percentage (float)
        campaign_budget: Campaign budget in dollars (float)
        campaign_niche: Campaign niche category (str)
    
    Returns:
        dict: Prediction results with ROI and confidence metrics
    """
    try:
        model, scaler = load_or_train_model()
        
        # Prepare input features
        niche_encoded = encode_niche(campaign_niche)
        features = np.array([[
            influencer_followers,
            influencer_engagement,
            campaign_budget,
            niche_encoded
        ]])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Make prediction
        predicted_roi = float(model.predict(features_scaled)[0])
        
        # Calculate confidence (based on feature importance and variance)
        importances = model.feature_importances_
        confidence = min(100, max(50, predicted_roi * 0.8 + np.mean(importances) * 100))
        
        # Calculate expected return
        expected_return = (campaign_budget * predicted_roi) / 100
        
        # Calculate success probability (higher ROI = higher probability)
        success_probability = min(95, max(5, predicted_roi / 2 + 20))
        
        return {
            'success': True,
            'predicted_roi': round(predicted_roi, 2),
            'expected_return': round(expected_return, 2),
            'confidence': round(confidence, 1),
            'success_probability': round(success_probability, 1),
            'recommendation': (
                'Highly Recommended' if predicted_roi > 50 else
                'Recommended' if predicted_roi > 35 else
                'Moderate Interest' if predicted_roi > 20 else
                'Consider Alternatives'
            )
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'predicted_roi': 0,
            'expected_return': 0,
            'confidence': 0,
            'success_probability': 0,
            'recommendation': 'Error in prediction'
        }

def main():
    """CLI interface for predictions."""
    if len(sys.argv) < 5:
        print(json.dumps({
            'error': 'Usage: predict.py <followers> <engagement> <budget> <niche>'
        }))
        sys.exit(1)
    
    try:
        followers = float(sys.argv[1])
        engagement = float(sys.argv[2])
        budget = float(sys.argv[3])
        niche = sys.argv[4]
        
        result = predict_campaign_performance(followers, engagement, budget, niche)
        print(json.dumps(result))
    except ValueError as e:
        print(json.dumps({'error': f'Invalid input: {str(e)}'}))
        sys.exit(1)

if __name__ == '__main__':
    main()
