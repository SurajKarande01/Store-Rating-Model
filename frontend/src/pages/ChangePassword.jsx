import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { KeyRound, LockKeyhole, Check, Loader2 } from 'lucide-react';

const validate = (form) => {
  const errors = {};
  if (!form.currentPassword) {
    errors.currentPassword = 'Current password is required.';
  }
  if (form.newPassword.length < 8 || form.newPassword.length > 16) {
    errors.newPassword = 'Password must be 8-16 characters.';
  } else if (!/[A-Z]/.test(form.newPassword)) {
    errors.newPassword = 'Must include at least one uppercase letter.';
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.newPassword)) {
    errors.newPassword = 'Must include at least one special character.';
  }
  if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }
  return errors;
};

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
          <KeyRound className="text-violet-500" size={24} />
          Change Password
        </h1>
        <p className="text-slate-400 text-sm mt-1">Update your account credentials to keep it secure</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass-card rounded-2xl p-6 border-slate-800"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Current Password
            </label>
            <div className="relative">
              <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                name="currentPassword"
                type="password"
                className={`w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm ${
                  errors.currentPassword ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={handleChange}
                required
              />
            </div>
            {errors.currentPassword && <p className="text-red-400 text-xs mt-1">{errors.currentPassword}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              New Password (8-16 chars, 1 Upper, 1 Special)
            </label>
            <div className="relative">
              <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                name="newPassword"
                type="password"
                className={`w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm ${
                  errors.newPassword ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Confirm New Password
            </label>
            <div className="relative">
              <Check className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                name="confirmPassword"
                type="password"
                className={`w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm ${
                  errors.confirmPassword ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 gradient-button mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
