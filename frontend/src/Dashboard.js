import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [influencers, setInfluencers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/influencers')
      .then((res) => res.json())
      .then((data) => setInfluencers(data));
  }, []);

  return (
    <div>
      <h1>Terra-ser Influence Intelligence™ Dashboard</h1>
      <ul>
        {influencers.map((inf) => (
          <li key={inf.id}>
            {inf.name} - {inf.followers} followers - Engagement: {inf.engagementRate}%
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
