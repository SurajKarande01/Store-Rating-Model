import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errors = {};
  if (form.name.length < 20 || form.name.length > 60) errors.name = 'Name must be 20-60 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format.';
  if (form.password.length < 8 || form.password.length > 16) errors.password = 'Password must be 8-16 characters.';
  else if (!/[A-Z]/.test(form.password)) errors.password = 'Must include an uppercase letter.';
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) errors.password = 'Must include a special character.';
  if (form.address.length > 400) errors.address = 'Address max 400 characters.';
  return errors;
};

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setLoading(true);
    try {
      await api.post('/auth/signup', form);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join the platform to rate your favorite stores</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-name">Full Name (20-60 chars)</label>
            <input id="signup-name" name="name" className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name" value={form.name} onChange={handleChange} required />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="signup-address">Address</label>
            <textarea id="signup-address" name="address" className={`form-textarea ${errors.address ? 'error' : ''}`}
              placeholder="Your address (max 400 chars)" value={form.address} onChange={handleChange} />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="signup-password">Password (8-16 chars, 1 uppercase, 1 special)</label>
            <input id="signup-password" name="password" type="password" className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••" value={form.password} onChange={handleChange} required />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
