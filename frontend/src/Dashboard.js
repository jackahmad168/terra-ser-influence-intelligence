import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [influencers, setInfluencers] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://terra-ser-influence-intelligence-1.onrender.com';

  useEffect(() => {
    fetch(`${API_URL}/api/influencers`)
      .then((res) => res.json())
      .then((data) => setInfluencers(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Terra-ser Influence Intelligence™ Dashboard</h1>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {influencers.length === 0 && !error && <p>Loading influencers...</p>}
      <ul>
        {influencers.map((inf) => (
          <li key={inf.id}>
            {inf.name} - {inf.followers} followers - Engagement: {inf.engagement_rate}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
