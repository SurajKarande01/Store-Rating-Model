import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import StarRating from '../components/StarRating';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, RefreshCw, ArrowUpDown, ChevronUp, ChevronDown, SlidersHorizontal, Loader2, Pin, Trash2, Edit, X, User, Phone, Shield, FileText, Send } from 'lucide-react';

/**
 * UserStores component.
 */
const UserStores = () => {
  const currentUser = useAuthStore((state) => state.user);
  const updateUserProfile = useAuthStore((state) => state.updateUserProfile);

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Upgrade requests loading
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  // Profile modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    address: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Store details & reviews modal state
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Review submission state
  const [ratingVal, setRatingVal] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

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

  /**
   * Handles the requestUpgrade event.
   */
  const handleRequestUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const { data } = await api.post('/users/request-moderator');
      updateUserProfile({ requestedModerator: true });
      toast.success(data.message || 'Moderator upgrade requested successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upgrade request failed.');
    } finally {
      setUpgradeLoading(false);
    }
  };

  /**
   * openProfileModal utility/helper function.
   */
  const openProfileModal = () => {
    setProfileForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      location: currentUser.location || '',
      address: currentUser.address || ''
    });
    setProfileModalOpen(true);
  };

  /**
   * Handles the profileSubmit event.
   */
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data: updatedUser } = await api.put('/users/profile', profileForm);
      updateUserProfile(updatedUser);
      toast.success('Profile updated successfully!');
      setProfileModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile update failed.');
    } finally {
      setProfileLoading(false);
    }
  };

  /**
   * openStoreModal utility/helper function.
   */
  const openStoreModal = async (store) => {
    setSelectedStore(store);
    setRatingVal(store.userRating || 0);
    // Find if user left a review comment previously
    setCommentText('');
    setStoreModalOpen(true);
    fetchReviews(store.id, store.userRatingId);
  };

  /**
   * Fetches reviews data from the API.
   */
  const fetchReviews = async (storeId, userRatingId) => {
    setReviewsLoading(true);
    try {
      const { data } = await api.get(`/stores/${storeId}/ratings`);
      setReviews(data);
      if (userRatingId) {
        const myReview = data.find(r => r.id === userRatingId);
        if (myReview) {
          setCommentText(myReview.comment || '');
        }
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  /**
   * Handles the reviewSubmit event.
   */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (ratingVal < 1 || ratingVal > 5) {
      toast.error('Please select a rating between 1 and 5 stars.');
      return;
    }

    setSubmitLoading(true);
    try {
      if (selectedStore.userRatingId) {
        await api.put(`/ratings/${selectedStore.userRatingId}`, { rating: ratingVal, comment: commentText });
        toast.success('Your review was updated successfully!');
      } else {
        await api.post('/ratings', { storeId: selectedStore.id, rating: ratingVal, comment: commentText });
        toast.success('Your review was submitted successfully!');
      }
      // Refresh details and store list
      fetchStores();
      setStoreModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitLoading(false);
    }
  };

  /**
   * Handles the deleteReview event.
   */
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    try {
      const deleteUrl = currentUser.role === 'moderator' ? `/moderator/reviews/${reviewId}` : `/ratings/${reviewId}`;
      await api.delete(deleteUrl);
      toast.success('Review deleted successfully.');
      fetchStores();
      if (selectedStore) {
        fetchReviews(selectedStore.id, selectedStore.userRatingId);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete review.');
    }
  };

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
    if (sortBy !== field) return <ArrowUpDown size={14} className="text-slate-500 transition-colors" />;
    return sortOrder === 'asc' 
      ? <ChevronUp size={14} className="text-violet-400" />
      : <ChevronDown size={14} className="text-violet-400" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Banner */}
      <div className="glass-card rounded-2xl p-6 border-slate-800/80 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Welcome back, <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{currentUser.name}</span>!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Role: <span className="capitalize font-semibold text-violet-400">{currentUser.role === 'user' ? 'Rater' : currentUser.role}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Moderator Request Button / Status */}
          {currentUser.role === 'user' && !currentUser.requestedModerator && (
            <button
              onClick={handleRequestUpgrade}
              disabled={upgradeLoading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-650 hover:bg-violet-600 disabled:opacity-50 text-white transition-all shadow-md shadow-violet-600/10 outline-none"
            >
              <Shield size={13} />
              <span>Request Upgrade to Moderator</span>
            </button>
          )}

          {currentUser.role === 'user' && currentUser.requestedModerator && (
            <span className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 text-violet-300 text-xs font-bold border border-violet-500/25 animate-pulse flex items-center gap-1.5">
              <Shield size={13} />
              <span>Upgrade Pending Approval</span>
            </span>
          )}

          {currentUser.role === 'moderator' && (
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/25 flex items-center gap-1.5">
              <Shield size={13} />
              <span>Moderator Privileges Active</span>
            </span>
          )}

          <button
            onClick={openProfileModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all outline-none"
          >
            <User size={13} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">🏪</span>
            Browse Stores
          </h1>
          <p className="text-slate-400 text-sm mt-1">View stores, browse customer reviews, and submit ratings</p>
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
                    Review / Ratings
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-violet-400 hover:text-violet-300 cursor-pointer transition-colors" onClick={() => openStoreModal(s)}>
                          {s.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                          {s.address || <span className="text-slate-650 italic">No address provided</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2.5">
                            <StarRating rating={Math.round(Number(s.overallRating))} readonly size={12} />
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
                          <button
                            onClick={() => openStoreModal(s)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-250 font-bold transition-all outline-none"
                          >
                            {s.userRating ? 'Edit Review' : 'Add Review'}
                          </button>
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

      {/* Edit Profile Dialog */}
      <Dialog.Root open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 animate-in fade-in duration-100" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 outline-none text-slate-100">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <User size={18} className="text-violet-500" />
                Edit Profile Settings
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800 outline-none">
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    required
                    className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Email</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 text-slate-500" size={16} />
                  <textarea
                    rows={2.5}
                    className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm resize-none"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2.5">
                <Dialog.Close asChild>
                  <button type="button" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors outline-none">
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-4 py-2 gradient-button text-xs font-bold rounded-xl transition-all outline-none flex items-center gap-1.5"
                >
                  {profileLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Store details and reviews dialog */}
      <Dialog.Root open={storeModalOpen} onOpenChange={setStoreModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 animate-in fade-in duration-100" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 outline-none text-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
            {selectedStore && (
              <>
                {/* Banner Header */}
                <div className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center shrink-0 border-b border-slate-800/80">
                  {selectedStore.imageUrl ? (
                    <img src={selectedStore.imageUrl} alt={selectedStore.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-650 flex flex-col items-center gap-1.5 select-none">
                      <Star size={40} className="stroke-[1.5]" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">Store Registry Details</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  <Dialog.Close asChild>
                    <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 outline-none">
                      <X size={16} />
                    </button>
                  </Dialog.Close>
                  <div className="absolute bottom-4 left-5 pr-5">
                    <h3 className="text-xl font-extrabold text-slate-100 leading-tight drop-shadow-md">{selectedStore.name}</h3>
                    <p className="text-xs text-slate-350 mt-1 flex items-center gap-1 drop-shadow-sm"><MapPin size={11} />{selectedStore.address}</p>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                  {/* Customer Review List */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <span>Customer Reviews</span>
                      <span className="text-[10px] text-slate-600 font-medium">({reviews.length} total)</span>
                    </h4>

                    {reviewsLoading ? (
                      <div className="py-8 flex justify-center items-center gap-2 text-slate-500">
                        <Loader2 className="animate-spin" size={16} />
                        <span className="text-xs">Loading reviews...</span>
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="bg-slate-950/40 border border-slate-850 p-6 rounded-xl text-center text-xs text-slate-500 italic">
                        No reviews have been written for this store yet. Be the first to leave one!
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {reviews.map((r) => {
                          const isOwnReview = r.userId === currentUser.id;
                          const showDelete = currentUser.role === 'admin' || currentUser.role === 'moderator';
                          
                          return (
                            <div key={r.id} className={`p-4 rounded-xl border transition-colors flex flex-col justify-between ${
                              r.pinned 
                                ? 'bg-amber-500/5 border-amber-500/20' 
                                : 'bg-slate-950/40 border-slate-850'
                            }`}>
                              <div className="flex justify-between items-start gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-200">
                                      {r.userName} {isOwnReview && <span className="text-[10px] text-violet-400 font-medium">(You)</span>}
                                    </span>
                                    {r.pinned && (
                                      <span className="px-1.5 py-0.2 rounded bg-amber-500/25 text-amber-300 text-[8px] font-extrabold tracking-wider flex items-center gap-0.5 border border-amber-500/20">
                                        <Pin size={8} className="fill-amber-300" /> PINNED
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <StarRating rating={r.rating} readonly size={10} />
                                    <span className="text-[10px] text-slate-500 font-medium">
                                      {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                  </div>
                                </div>

                                {showDelete && (
                                  <button
                                    onClick={() => handleDeleteReview(r.id)}
                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/10 hover:border-red-500 transition-all outline-none"
                                    title="Delete Review"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>

                              {r.comment && (
                                <p className="text-xs text-slate-350 mt-2.5 leading-relaxed break-words">
                                  {r.comment}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Submission Form (Only for simple users or moderators upgraded from user, i.e., NOT admins or store owners) */}
                  {(currentUser.role === 'user' || currentUser.role === 'moderator') && (
                    <div className="border-t border-slate-800/80 pt-5 mt-4">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-1">
                        <Edit size={12} className="text-violet-500" />
                        {selectedStore.userRatingId ? 'Edit Your Review' : 'Write a Review'}
                      </h4>

                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Select Rating</label>
                          <div className="flex items-center gap-2">
                            <StarRating
                              rating={ratingVal}
                              onRate={(val) => setRatingVal(val)}
                              size={22}
                            />
                            {ratingVal > 0 && (
                              <span className="text-sm font-extrabold text-amber-400">{ratingVal} Stars</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Write Feedback Comment</label>
                          <div className="relative">
                            <FileText className="absolute left-3.5 top-3 text-slate-500" size={16} />
                            <textarea
                              rows={3}
                              maxLength={1000}
                              className="w-full pl-10 pr-4 py-2.5 glass-input text-slate-200 text-xs resize-none"
                              placeholder="Share details of your experience at this store..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={submitLoading || ratingVal === 0}
                            className="px-4 py-2 gradient-button text-xs font-bold rounded-xl transition-all outline-none flex items-center gap-1.5 shadow-md shadow-violet-600/10 disabled:opacity-50"
                          >
                            {submitLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                            <span>{selectedStore.userRatingId ? 'Update Review' : 'Submit Review'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default UserStores;
