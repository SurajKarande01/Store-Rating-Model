import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AdminAddUser = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
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
      await api.post('/admin/users', form);
      toast.success('User created successfully!');
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '550px' }}>
      <div className="dashboard-header">
        <h1>➕ Add New User</h1>
        <p>Create a new user account on the platform</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="au-name">Name (20-60 chars)</label>
            <input id="au-name" name="name" className={`form-input ${errors.name ? 'error' : ''}`}
              value={form.name} onChange={handleChange} placeholder="Full name" required />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="au-email">Email</label>
            <input id="au-email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
              value={form.email} onChange={handleChange} placeholder="user@example.com" required />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="au-address">Address</label>
            <textarea id="au-address" name="address" className={`form-textarea ${errors.address ? 'error' : ''}`}
              value={form.address} onChange={handleChange} placeholder="User address (max 400 chars)" />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="au-password">Password (8-16 chars, 1 uppercase, 1 special)</label>
            <input id="au-password" name="password" type="password" className={`form-input ${errors.password ? 'error' : ''}`}
              value={form.password} onChange={handleChange} placeholder="••••••••" required />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="au-role">Role</label>
            <select id="au-role" name="role" className="form-select" value={form.role} onChange={handleChange}>
              <option value="user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUser;
