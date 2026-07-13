import React, { useEffect, useState } from 'react';
import { getCampaigns, createCampaign } from './api';
import { useAuth } from './AuthContext';
import './Campaigns.css';

function Campaigns() {
  const { token, user, logout } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', niche: '', budget: '' });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getCampaigns(token);
      setCampaigns(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      const newCampaign = await createCampaign(token, formData);
      if (newCampaign.error) {
        setError(newCampaign.error);
      } else {
        setCampaigns([newCampaign, ...campaigns]);
        setFormData({ title: '', niche: '', budget: '' });
        setShowForm(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="campaigns-container">
      <header className="campaigns-header">
        <div>
          <h1>My Campaigns</h1>
          <p>Welcome, {user?.name || user?.email}!</p>
        </div>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      {error && <div className="error">{error}</div>}

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="create-btn">
          + New Campaign
        </button>
      ) : (
        <form onSubmit={handleCreateCampaign} className="campaign-form">
          <input
            type="text"
            placeholder="Campaign Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Niche (e.g., F&B, Beauty)"
            value={formData.niche}
            onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Budget"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
          <div className="form-actions">
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading campaigns...</p>
      ) : campaigns.length === 0 ? (
        <p className="empty">No campaigns yet. Create one to get started!</p>
      ) : (
        <div className="campaigns-list">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="campaign-card">
              <h3>{campaign.title}</h3>
              <p><strong>Niche:</strong> {campaign.niche}</p>
              <p><strong>Budget:</strong> ${campaign.budget || '0.00'}</p>
              <p><strong>Status:</strong> <span className="status">{campaign.status}</span></p>
              <p className="date">Created: {new Date(campaign.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Campaigns;
