import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import axios from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import './users.css'


const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', form);
      localStorage.setItem('token', res.data.token); 
      navigate('/dashboard'); 
    toast.success('Account created successfully!');

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-container">
      <form onSubmit={handleSubmit} className="user-form">
        <h2>Register</h2>
        <input 
          type="text" 
          name="name"
          placeholder="Name"
          className="input"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input"
          onChange={handleChange}
          required
        />
        <button type="submit" className="user-btn">Sign Up</button>

        <p>
          Already have an account? <Link to="/login" className='user-login'>Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
