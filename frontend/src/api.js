const API_URL = process.env.REACT_APP_API_URL || 'https://terra-ser-influence-intelligence-1.onrender.com';

export async function register(email, password, name) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function getCampaigns(token) {
  const res = await fetch(`${API_URL}/api/campaigns`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function createCampaign(token, { title, niche, budget }) {
  const res = await fetch(`${API_URL}/api/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, niche, budget })
  });
  return res.json();
}

export async function getInfluencers() {
  const res = await fetch(`${API_URL}/api/influencers`);
  return res.json();
}
