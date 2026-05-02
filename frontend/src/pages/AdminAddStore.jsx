import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errors = {};
  if (form.name.length < 20 || form.name.length > 60) errors.name = 'Store name must be 20-60 characters.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format.';
  if (form.address.length > 400) errors.address = 'Address max 400 characters.';
  return errors;
};

const AdminAddStore = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const { data } = await api.get('/admin/users', { params: { role: 'store_owner' } });
        setOwners(data);
      } catch (err) { console.error(err); }
    };
    fetchOwners();
  }, []);

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
      await api.post('/admin/stores', { ...form, ownerId: form.ownerId || undefined });
      toast.success('Store created successfully!');
      navigate('/admin/stores');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '550px' }}>
      <div className="dashboard-header">
        <h1>🏪 Add New Store</h1>
        <p>Register a new store on the platform</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="as-name">Store Name (20-60 chars)</label>
            <input id="as-name" name="name" className={`form-input ${errors.name ? 'error' : ''}`}
              value={form.name} onChange={handleChange} placeholder="Store name" required />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="as-email">Store Email</label>
            <input id="as-email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
              value={form.email} onChange={handleChange} placeholder="store@example.com" required />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="as-address">Address</label>
            <textarea id="as-address" name="address" className={`form-textarea ${errors.address ? 'error' : ''}`}
              value={form.address} onChange={handleChange} placeholder="Store address (max 400 chars)" />
            {errors.address && <div className="form-error">{errors.address}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="as-owner">Owner (optional)</label>
            <select id="as-owner" name="ownerId" className="form-select" value={form.ownerId} onChange={handleChange}>
              <option value="">No owner assigned</option>
              {owners.map((o) => (<option key={o.id} value={o.id}>{o.name} ({o.email})</option>))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Create Store'}</button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/stores')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddStore;
