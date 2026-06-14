import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import StarRating from '../components/StarRating';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Star, Award, Store, MessageSquare, Calendar, Loader2, RefreshCw, Pin, PinOff, Image, Edit, X, Phone, MapPin, FileText, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';

const StoreOwnerDashboard = () => {
  const currentUser = useAuthStore((state) => state.user);
  const updateUserProfile = useAuthStore((state) => state.updateUserProfile);

  const [data, setData] = useState({ stores: [], averageRating: '0.0', totalRatings: 0, raters: [] });
  const [loading, setLoading] = useState(true);
  const [pinLoading, setPinLoading] = useState(false);

  // Profile modal state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    address: '',
    storeDescription: ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Store image modal state
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

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

  const openProfileModal = () => {
    setProfileForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      location: currentUser.location || '',
      address: currentUser.address || '',
      storeDescription: currentUser.storeDescription || ''
    });
    setProfileModalOpen(true);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { data: updatedUser } = await api.put('/users/profile', profileForm);
      updateUserProfile(updatedUser);
      toast.success('Profile updated successfully!');
      setProfileModalOpen(false);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const openImageModal = (store) => {
    setSelectedStore(store);
    setImageUrl(store.imageUrl || '');
    setImageModalOpen(true);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setImageLoading(true);
    try {
      await api.put('/store-owner/store/image', { imageUrl });
      toast.success('Store image updated successfully!');
      setImageModalOpen(false);
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update store image.');
    } finally {
      setImageLoading(false);
    }
  };

  const togglePin = async (ratingId) => {
    setPinLoading(true);
    try {
      await api.put(`/store-owner/ratings/${ratingId}/pin`);
      toast.success('Rating pinned status updated.');
      fetchDashboard();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update pin status.');
    } finally {
      setPinLoading(false);
    }
  };

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
          <p className="text-slate-400 text-sm mt-1">Monitor user reviews, update store assets, and edit your profile</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={openProfileModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-650 hover:bg-violet-600 text-white transition-all shadow-md shadow-violet-600/10 outline-none"
          >
            <Edit size={14} />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={fetchDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all outline-none"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh Stats
          </button>
        </div>
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

      {/* Outlets Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Store size={18} className="text-violet-500" />
          Outlets Directory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.stores.map((store) => (
            <div key={store.id} className="glass-card rounded-2xl border-slate-800/80 overflow-hidden flex flex-col hover:border-slate-700 transition-colors">
              <div className="h-40 bg-slate-900 relative overflow-hidden flex items-center justify-center border-b border-slate-800/80">
                {store.imageUrl ? (
                  <img src={store.imageUrl} alt={store.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-650 flex flex-col items-center gap-1.5 select-none">
                    <Store size={40} className="stroke-[1.5]" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">No Store Image</span>
                  </div>
                )}
                <button
                  onClick={() => openImageModal(store)}
                  className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-950/80 backdrop-blur border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-all shadow-lg outline-none"
                  title="Change Store Image"
                >
                  <Image size={15} />
                </button>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{store.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{store.address}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-850 flex justify-between items-center text-xs text-slate-500">
                  <span>Contact: {store.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Rating & Comment</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Review Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Pin Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {data.raters?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl">📭</span>
                      <p className="text-slate-400 font-semibold text-sm">No ratings received yet</p>
                      <p className="text-slate-500 text-xs">Customer feedback will show up here in real-time</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.raters?.map((r) => (
                  <tr key={r.ratingId} className={`hover:bg-slate-900/40 transition-colors ${r.pinned ? 'bg-violet-950/10' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-200">
                      <div className="flex items-center gap-2">
                        <span>{r.name}</span>
                        {r.pinned && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30 flex items-center gap-0.5">
                            <Pin size={8} className="fill-amber-300" /> PINNED
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{r.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300 font-medium">{r.storeName}</td>
                    <td className="px-6 py-4 text-sm max-w-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={r.rating} readonly size={12} />
                        <span className="font-bold text-amber-400">{r.rating}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-xs break-words">
                        {r.comment || <span className="text-slate-650 italic">No feedback comment left.</span>}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                      {new Date(r.createdAt || r.updatedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <button
                        onClick={() => togglePin(r.ratingId)}
                        disabled={pinLoading}
                        className={`p-2 rounded-xl transition-all border outline-none ${
                          r.pinned 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' 
                            : 'bg-slate-900 text-slate-450 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                        title={r.pinned ? 'Unpin from Top' : 'Pin to Top'}
                      >
                        {r.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

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
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
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
                    rows={2}
                    className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm resize-none"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Store Description</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 text-slate-500" size={16} />
                  <textarea
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm resize-none"
                    value={profileForm.storeDescription}
                    onChange={(e) => setProfileForm({ ...profileForm, storeDescription: e.target.value })}
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

      {/* Edit Store Image Dialog */}
      <Dialog.Root open={imageModalOpen} onOpenChange={setImageModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 animate-in fade-in duration-100" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 outline-none text-slate-100">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Image size={18} className="text-violet-500" />
                Update Store Banner Image
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800 outline-none">
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleImageSubmit} className="space-y-4">
              {imageUrl && (
                <div className="h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-850 flex items-center justify-center">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Image URL</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
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
                  disabled={imageLoading}
                  className="px-4 py-2 gradient-button text-xs font-bold rounded-xl transition-all outline-none flex items-center gap-1.5"
                >
                  {imageLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                  <span>Update Image</span>
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default StoreOwnerDashboard;
