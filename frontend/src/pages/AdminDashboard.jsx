import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Users, Store, Star, RefreshCw, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      toast.error('Could not load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && stats.totalUsers === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center gap-3">
        <Loader2 className="animate-spin text-violet-500" size={32} />
        <p className="text-slate-400 text-sm">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">📊</span>
            Admin Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage users, stores, and monitor general rating statistics</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all outline-none"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh Stats
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Users */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl p-6 border-slate-800/80 relative overflow-hidden group hover:border-violet-500/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Users</p>
              <h3 className="text-4xl font-extrabold text-slate-100 mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-violet-500/10 rounded-xl text-violet-400 border border-violet-500/25">
              <Users size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-800/50">
            Registered accounts on the platform
          </p>
        </motion.div>

        {/* Total Stores */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border-slate-800/80 relative overflow-hidden group hover:border-violet-500/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Stores</p>
              <h3 className="text-4xl font-extrabold text-slate-100 mt-1">{stats.totalStores}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/25">
              <Store size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-800/50">
            Active storefronts currently registered
          </p>
        </motion.div>

        {/* Total Ratings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border-slate-800/80 relative overflow-hidden group hover:border-violet-500/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Ratings</p>
              <h3 className="text-4xl font-extrabold text-slate-100 mt-1">{stats.totalRatings}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/25">
              <Star size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-800/50">
            Ratings submitted across all stores
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
