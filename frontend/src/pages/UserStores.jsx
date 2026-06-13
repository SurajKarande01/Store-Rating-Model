import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, RefreshCw, ArrowUpDown, ChevronUp, ChevronDown, SlidersHorizontal } from 'lucide-react';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...search, sortBy, sortOrder };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const { data } = await api.get('/stores', { params });
      setStores(data);
    } catch (err) {
      console.error('Failed to load stores:', err);
      toast.error('Could not load stores registry.');
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRate = async (storeId, rating, existingRatingId) => {
    try {
      if (existingRatingId) {
        await api.put(`/ratings/${existingRatingId}`, { rating });
        toast.success('Rating updated successfully!');
      } else {
        await api.post('/ratings', { storeId, rating });
        toast.success('Rating submitted successfully!');
      }
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ArrowUpDown size={14} className="text-slate-500 transition-colors" />;
    return sortOrder === 'asc' 
      ? <ChevronUp size={14} className="text-violet-400" />
      : <ChevronDown size={14} className="text-violet-400" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">🏪</span>
            Browse Stores
          </h1>
          <p className="text-slate-400 text-sm mt-1">Rate and review stores registered on the platform</p>
        </div>
        <button
          onClick={fetchStores}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all outline-none"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh Registry
        </button>
      </div>

      {/* Filter panel */}
      <div className="glass-card rounded-2xl p-5 border-slate-800/80 mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold whitespace-nowrap">
          <SlidersHorizontal size={16} />
          <span>Filters:</span>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
            placeholder="Search by store name..."
            value={search.name}
            onChange={(e) => setSearch({ ...search, name: e.target.value })}
          />
        </div>
        <div className="relative w-full md:w-72">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
            placeholder="Search by address..."
            value={search.address}
            onChange={(e) => setSearch({ ...search, address: e.target.value })}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="glass-card rounded-2xl border-slate-800/80 overflow-hidden shadow-xl">
        {loading && stores.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-violet-500" size={32} />
            <p className="text-slate-400 text-sm">Fetching store registry...</p>
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
                    onClick={() => handleSort('address')}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>Address</span>
                      <SortIcon field="address" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('overallRating')}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>Overall Rating</span>
                      <SortIcon field="overallRating" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Your Rating
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Rate This Store
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                <AnimatePresence>
                  {stores.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-3xl">🏜️</span>
                          <p className="text-slate-400 font-semibold text-sm">No stores found</p>
                          <p className="text-slate-500 text-xs">Try adjusting your filters or search keywords</p>
                        </div>
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
                        <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                          {s.address || <span className="text-slate-650 italic">No address provided</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2.5">
                            <StarRating rating={Math.round(Number(s.overallRating))} readonly size={14} />
                            <span className="font-bold text-amber-400">
                              {Number(s.overallRating).toFixed(1)}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              ({s.totalRatings} {s.totalRatings === 1 ? 'rating' : 'ratings'})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {s.userRating ? (
                            <div className="flex items-center gap-1.5">
                              <Star size={14} className="text-amber-400 fill-amber-400" />
                              <span className="font-bold text-slate-200">{s.userRating}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 italic">Not rated</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <StarRating
                            rating={s.userRating || 0}
                            onRate={(rating) => handleRate(s.id, rating, s.userRatingId)}
                            size={16}
                          />
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

export default UserStores;
