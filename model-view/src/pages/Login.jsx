import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import './users.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);

      localStorage.setItem('token', res.data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      alert(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="user-container">
      <form onSubmit={handleSubmit} className="user-logform">
        <h2>Sign In</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="user-btn1">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
