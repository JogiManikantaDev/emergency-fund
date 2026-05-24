import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', fontFamily: 'Arial', padding: '0 20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Login</h2>

      {error && (
        <div style={{ background: '#fff2f2', border: '1px solid #ffccc7', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#cf1322', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#555' }}>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{ width: '100%', padding: '12px', background: '#2d8a2d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}>
          Login
        </button>
      </div>

      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#888' }}>
        No account?{' '}
        <span onClick={() => navigate('/register')} style={{ color: '#2d8a2d', cursor: 'pointer', fontWeight: 'bold' }}>
          Register here
        </span>
      </p>

      <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px', color: '#888' }}>
        <span onClick={() => navigate('/')} style={{ color: '#888', cursor: 'pointer' }}>
          ← Back to home
        </span>
      </p>
    </div>
  );
}

export default Login;