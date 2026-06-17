import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Lock, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

/**
 * Validates the input form/data.
 */
const validate = (form) => {
  const errors = {};
  if (form.name.length < 20 || form.name.length > 60) {
    errors.name = 'Name must be 20-60 characters.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Invalid email format.';
  }
  if (form.password.length < 8 || form.password.length > 16) {
    errors.password = 'Password must be 8-16 characters.';
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = 'Must include at least one uppercase letter.';
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
    errors.password = 'Must include at least one special character.';
  }
  if (form.address.length > 400) {
    errors.address = 'Address cannot exceed 400 characters.';
  }
  return errors;
};

/**
 * AdminAddUser component.
 */
const AdminAddUser = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles the change event.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  /**
   * Handles the submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Back link & Title */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-350 transition-colors mb-2 outline-none"
        >
          <ArrowLeft size={14} />
          Back to Registry
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
          <User className="text-violet-500" size={24} />
          Create New User
        </h1>
        <p className="text-slate-400 text-sm mt-1">Register a new user account with role-based access</p>
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
              Full Name (20-60 chars)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                name="name"
                type="text"
                className={`w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm ${
                  errors.name ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                name="email"
                type="email"
                className={`w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm ${
                  errors.email ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Physical Address (max 400 chars)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 text-slate-500" size={18} />
              <textarea
                name="address"
                rows={2}
                className={`w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm resize-none ${
                  errors.address ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
                placeholder="Physical address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Password (8-16 chars, 1 Upper, 1 Special)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                name="password"
                type="password"
                className={`w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm ${
                  errors.password ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              User Role
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <select
                name="role"
                className="w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm cursor-pointer"
                value={form.role}
                onChange={handleChange}
              >
                <option value="user">Rater (Normal User)</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 gradient-button"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <span>Register User</span>
              )}
            </motion.button>
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50 transition-colors outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminAddUser;
