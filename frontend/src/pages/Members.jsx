import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Members() {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donations/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const byUser = {};
      res.data.forEach(d => {
        const id = d.user._id;
        if (!byUser[id]) byUser[id] = { user: d.user, total: 0, count: 0 };
        byUser[id].total += d.amount;
        byUser[id].count += 1;
      });

      const sorted = Object.values(byUser).sort((a, b) => b.total - a.total);
      setMembers(sorted);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '550px', margin: '40px auto', fontFamily: 'Arial', padding: '0 20px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Members</h2>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: '14px' }}>All contributors</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/')}
            style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Home
          </button>
          <button onClick={() => navigate('/dashboard')}
            style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Dashboard
          </button>
          <button onClick={handleLogout}
            style={{ padding: '8px 16px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '24px' }}>
        {members.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', fontSize: '14px' }}>No members yet.</p>
        ) : (
          members.map((m, index) => (
            <div key={m.user._id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: index === 0 ? '#ffd700' : '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '15px', color: index === 0 ? '#7a6000' : '#2d8a2d', flexShrink: 0 }}>
                {m.user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '15px' }}>
                  {m.user.name} {index === 0 ? '🏆' : ''}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#888' }}>
                  {m.count} donation{m.count !== 1 ? 's' : ''}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#2d8a2d', fontSize: '15px' }}>
                  ₹{m.total.toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Members;