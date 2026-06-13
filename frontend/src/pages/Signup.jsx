import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Lock, ArrowRight, Loader2, Star } from 'lucide-react';

const validate = (form) => {
  const errors = {};
  if (form.name.length < 20 || form.name.length > 60) {
    errors.name = 'Name must be between 20 and 60 characters.';
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

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      await api.post('/auth/signup', form);
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg glass-card rounded-2xl p-8 relative z-10 border-slate-800"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-violet-500/20 mb-4">
            <Star size={24} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">Join StorePulse and review local business registries</p>
        </div>

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
                placeholder="John Doe"
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
                placeholder="123 Main Street, City"
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
