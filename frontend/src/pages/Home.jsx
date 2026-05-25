import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://emergency-fund-backend.onrender.com')
      .then(res => setSummary(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Our Emergency Fund</h1>
      <p style={{ color: '#888', marginBottom: '32px' }}>Group savings for our friends</p>

      <div style={{ background: '#f0f9f0', border: '1px solid #c3e6c3', borderRadius: '12px', padding: '32px', marginBottom: '24px' }}>
        <p style={{ color: '#555', margin: '0 0 8px' }}>Total fund collected</p>
        <h2 style={{ fontSize: '42px', color: '#2d8a2d', margin: '0' }}>
          ₹{summary ? summary.totalFund.toLocaleString() : '...'}
        </h2>
        <p style={{ color: '#888', marginTop: '8px' }}>
          {summary ? summary.memberCount : '...'} members contributing
        </p>
      </div>

      {summary && summary.topDonor && (
        <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <p style={{ color: '#888', margin: '0 0 12px', fontSize: '14px' }}>Top contributor this month</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ffd700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold', color: '#7a6000' }}>
              {summary.topDonor.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{summary.topDonor.name}</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Highest contributor</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button onClick={() => navigate('/login')}
          style={{ padding: '12px 28px', background: '#2d8a2d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}>
          Login
        </button>
        <button onClick={() => navigate('/register')}
          style={{ padding: '12px 28px', background: 'white', color: '#2d8a2d', border: '1px solid #2d8a2d', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Home;