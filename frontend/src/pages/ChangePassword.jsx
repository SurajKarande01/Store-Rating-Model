import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errors = {};
  if (!form.currentPassword) errors.currentPassword = 'Current password is required.';
  if (form.newPassword.length < 8 || form.newPassword.length > 16) errors.newPassword = 'Password must be 8-16 characters.';
  else if (!/[A-Z]/.test(form.newPassword)) errors.newPassword = 'Must include an uppercase letter.';
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword)) errors.newPassword = 'Must include a special character.';
  if (form.newPassword !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
};

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      await api.put('/users/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '500px' }}>
      <div className="dashboard-header">
        <h1>🔒 Change Password</h1>
        <p>Update your account password</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cp-current">Current Password</label>
            <input id="cp-current" name="currentPassword" type="password" className={`form-input ${errors.currentPassword ? 'error' : ''}`}
              value={form.currentPassword} onChange={handleChange} placeholder="Enter current password" />
            {errors.currentPassword && <div className="form-error">{errors.currentPassword}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="cp-new">New Password (8-16 chars, 1 uppercase, 1 special)</label>
            <input id="cp-new" name="newPassword" type="password" className={`form-input ${errors.newPassword ? 'error' : ''}`}
              value={form.newPassword} onChange={handleChange} placeholder="Enter new password" />
            {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="cp-confirm">Confirm New Password</label>
            <input id="cp-confirm" name="confirmPassword" type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              value={form.confirmPassword} onChange={handleChange} placeholder="Confirm new password" />
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
