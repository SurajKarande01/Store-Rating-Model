import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Users, Store, Star, RefreshCw, Loader2, ListCollapse, Calendar, Activity as ActivityIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  const fetchStatsAndActivities = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data);
      
      setActivitiesLoading(true);
      const { data: actData } = await api.get('/admin/activities');
      setActivities(actData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast.error('Could not load dashboard information.');
    } finally {
      setLoading(false);
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndActivities();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">📊</span>
            Admin Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage users, stores, and monitor general rating statistics and recent activities</p>
        </div>
        <button
          onClick={fetchStatsAndActivities}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all outline-none"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh Stats & Activities
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* Activity Log Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="glass-card rounded-2xl border-slate-800/80 overflow-hidden shadow-xl"
      >
        <div className="px-6 py-5 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ActivityIcon size={18} className="text-violet-500 animate-pulse" />
            System Activity Log (All Users)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-800/80">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">User / Actor</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Action Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Details & Description</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>Logged Date & Time</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {activitiesLoading && activities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="animate-spin text-violet-500" size={20} />
                      <span className="text-xs">Loading activity log...</span>
                    </div>
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">🗂️</span>
                      <p className="text-slate-400 font-semibold text-sm">No activity records logged yet</p>
                      <p className="text-slate-500 text-xs">User action history will show up here automatically</p>
                    </div>
                  </td>
                </tr>
              ) : (
                activities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-200">
                      {act.userName || <span className="text-slate-600 italic">System</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        act.action.includes('DELETE') || act.action.includes('DEMOTE')
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : act.action.includes('CREATE') || act.action.includes('SUBMIT') || act.action.includes('PROMOTE')
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      }`}>
                        {act.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 leading-relaxed font-medium">
                      {act.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                      {new Date(act.createdAt).toLocaleString()}
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

export default AdminDashboard;
