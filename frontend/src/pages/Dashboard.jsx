import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [myDonations, setMyDonations] = useState([]);
  const [myTotal, setMyTotal] = useState(0);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMyDonations();
  }, []);

  const fetchMyDonations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donations/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyDonations(res.data.donations);
      setMyTotal(res.data.total);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDonate = async () => {
    setError('');
    setSuccess('');
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/donations',
        { amount: Number(amount), note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Donation added successfully!');
      setAmount('');
      setNote('');
      fetchMyDonations();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add donation');
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
          <h2 style={{ margin: 0 }}>My Dashboard</h2>
          <p style={{ margin: '4px 0 0', color: '#888', fontSize: '14px' }}>Welcome, {user?.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/members')}
  style={{ padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
  Members
</button>
          <button onClick={handleLogout}
            style={{ padding: '8px 16px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ background: '#f0f9f0', border: '1px solid #c3e6c3', borderRadius: '12px', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
        <p style={{ color: '#555', margin: '0 0 8px' }}>My total contribution</p>
        <h2 style={{ fontSize: '38px', color: '#2d8a2d', margin: 0 }}>₹{myTotal.toLocaleString()}</h2>
      </div>

      <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>Add a donation</h3>

        {error && (
          <div style={{ background: '#fff2f2', border: '1px solid #ffccc7', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', color: '#cf1322', fontSize: '14px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', color: '#389e0d', fontSize: '14px' }}>
            {success}
          </div>
        )}

        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. May contribution"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <button onClick={handleDonate}
          style={{ width: '100%', padding: '12px', background: '#2d8a2d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}>
          Add Donation
        </button>
      </div>

      <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>My donation history</h3>
        {myDonations.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', fontSize: '14px' }}>No donations yet. Add your first one above!</p>
        ) : (
          myDonations.map((d) => (
            <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#2d8a2d' }}>₹{d.amount.toLocaleString()}</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#888' }}>{d.note || 'No note'} · {new Date(d.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;