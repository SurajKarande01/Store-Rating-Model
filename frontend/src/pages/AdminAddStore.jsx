import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Store, Mail, MapPin, User, Loader2, ArrowLeft } from 'lucide-react';

const validate = (form) => {
  const errors = {};
  if (form.name.length < 20 || form.name.length > 60) {
    errors.name = 'Store name must be 20-60 characters.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Invalid email format.';
  }
  if (form.address.length > 400) {
    errors.address = 'Address cannot exceed 400 characters.';
  }
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
      } catch (err) {
        console.error('Failed to load store owners:', err);
      }
    };
    fetchOwners();
  }, []);

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
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Back link & Title */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/stores')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-350 transition-colors mb-2 outline-none"
        >
          <ArrowLeft size={14} />
          Back to Registry
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-100">
          <Store className="text-violet-500" size={24} />
          Register New Store
        </h1>
        <p className="text-slate-400 text-sm mt-1">Add a new store outlet to the public rating registry</p>
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
              Store Name (20-60 chars)
            </label>
            <div className="relative">
              <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                name="name"
                type="text"
                className={`w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm ${
                  errors.name ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
                placeholder="Store name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Store Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                name="email"
                type="email"
                className={`w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm ${
                  errors.email ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
                placeholder="store@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Store Location Address (max 400 chars)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 text-slate-500" size={18} />
              <textarea
                name="address"
                rows={2}
                className={`w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm resize-none ${
                  errors.address ? 'border-red-500/50 focus:border-red-500' : ''
                }`}
                placeholder="Store location address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Assigned Store Owner (optional)
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <select
                name="ownerId"
                className="w-full pl-11 pr-4 py-2.5 glass-input text-slate-200 text-sm cursor-pointer"
                value={form.ownerId}
                onChange={handleChange}
              >
                <option value="">No owner assigned (Unassigned)</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.email})
                  </option>
                ))}
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
                  <span>Registering Store...</span>
                </>
              ) : (
                <span>Register Store</span>
              )}
            </motion.button>
            <button
              type="button"
              onClick={() => navigate('/admin/stores')}
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

export default AdminAddStore;
