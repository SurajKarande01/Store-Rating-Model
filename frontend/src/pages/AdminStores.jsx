import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StarRating from '../components/StarRating';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, MapPin, Star, ArrowUpDown, ChevronUp, ChevronDown, Plus, RefreshCw, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * AdminStores component.
 */
const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy, sortOrder };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const { data } = await api.get('/admin/stores', { params });
      setStores(data);
    } catch (err) {
      console.error('Failed to load stores:', err);
      toast.error('Could not load stores registry.');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  /**
   * Handles the sort event.
   */
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  /**
   * SortIcon component.
   */
  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ArrowUpDown size={14} className="text-slate-500" />;
    return sortOrder === 'asc' 
      ? <ChevronUp size={14} className="text-violet-400" />
      : <ChevronDown size={14} className="text-violet-400" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">🏪</span>
            Stores Registry
          </h1>
          <p className="text-slate-400 text-sm mt-1">{stores.length} outlets registered on the platform</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchStores}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all outline-none"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <Link
            to="/admin/add-store"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold gradient-button"
          >
            <Plus size={16} />
            <span>Add Store</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5 border-slate-800/80 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
            placeholder="Search by store name..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
            placeholder="Search by store email..."
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
            placeholder="Search by address..."
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          />
        </div>
      </div>

      {/* Stores Table */}
      <div className="glass-card rounded-2xl border-slate-800/80 overflow-hidden shadow-xl">
        {loading && stores.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-violet-500" size={32} />
            <p className="text-slate-400 text-sm">Loading stores list...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800/80">
                  <th
                    onClick={() => handleSort('name')}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>Store Name</span>
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('email')}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>Email</span>
                      <SortIcon field="email" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('address')}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>Address</span>
                      <SortIcon field="address" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('rating')}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>Overall Rating</span>
                      <SortIcon field="rating" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                <AnimatePresence>
                  {stores.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center text-slate-550 text-sm">
                        No stores match the search filters.
                      </td>
                    </tr>
                  ) : (
                    stores.map((s) => (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-200">
                          {s.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {s.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                          {s.address || <span className="text-slate-750 italic">No address</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <StarRating rating={Math.round(Number(s.rating))} readonly size={12} />
                            <span className="font-bold text-amber-400">{Number(s.rating).toFixed(1)}</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStores;
