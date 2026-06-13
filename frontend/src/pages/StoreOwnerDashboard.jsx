import { useState, useEffect } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import { motion } from 'framer-motion';
import { Star, Award, Store, MessageSquare, Calendar, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const StoreOwnerDashboard = () => {
  const [data, setData] = useState({ stores: [], averageRating: '0.0', totalRatings: 0, raters: [] });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const { data: dashData } = await api.get('/store-owner/dashboard');
      setData(dashData);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      toast.error('Could not load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading && data.stores.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center gap-3">
        <Loader2 className="animate-spin text-violet-500" size={32} />
        <p className="text-slate-400 text-sm">Loading owner dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">🏪</span>
            Store Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Monitor user reviews and average store ratings</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all outline-none"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh Stats
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Avg Rating Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl p-6 border-slate-800/80 relative overflow-hidden group hover:border-violet-500/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Average Rating</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">
                {Number(data.averageRating).toFixed(1)}
              </h3>
            </div>
            <div className="p-3 bg-violet-500/10 rounded-xl text-violet-400 border border-violet-500/25">
              <Award size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/50">
            <StarRating rating={Math.round(Number(data.averageRating))} readonly size={14} />
            <span className="text-xs text-slate-500 font-medium">Out of 5 stars</span>
          </div>
        </motion.div>

        {/* Total Ratings Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card rounded-2xl p-6 border-slate-800/80 relative overflow-hidden group hover:border-violet-500/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Ratings</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">{data.totalRatings}</h3>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/25">
              <MessageSquare size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-800/50">
            Feedback received across all outlets
          </p>
        </motion.div>

        {/* Total Stores Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card rounded-2xl p-6 border-slate-800/80 relative overflow-hidden group hover:border-violet-500/50 transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-400">Registered Outlets</p>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-1">{data.stores?.length || 0}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/25">
              <Store size={20} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-800/50">
            Active storefronts assigned to you
          </p>
        </motion.div>
      </div>

      {/* Raters Table Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-card rounded-2xl border-slate-800/80 overflow-hidden shadow-xl"
      >
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <MessageSquare size={18} className="text-violet-500" />
            Recent Reviews & Customer Feedback
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800/80">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Customer Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Rated Outlet</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Rating</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>Review Date</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {data.raters?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">📭</span>
                      <p className="text-slate-400 font-semibold text-sm">No ratings received yet</p>
                      <p className="text-slate-500 text-xs">Customer feedback will show up here in real-time</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.raters?.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-200">{r.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{r.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-medium">{r.storeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <StarRating rating={r.rating} readonly size={12} />
                        <span className="font-bold text-amber-400">{r.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                      {new Date(r.createdAt || r.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default StoreOwnerDashboard;
