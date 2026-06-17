import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mail, MapPin, User, Phone, Globe, FileText, ArrowUpDown, ChevronUp, ChevronDown, Plus, RefreshCw, Eye, X, Star, Loader2, ShieldAlert, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * AdminUsers component.
 */
const AdminUsers = () => {
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy, sortOrder };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const { data } = await api.get('/admin/users', { params });
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      toast.error('Failed to load users list.');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  /**
   * viewUserDetail utility/helper function.
   */
  const viewUserDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const { data } = await api.get(`/admin/users/${id}`);
      setSelectedUser(data);
      setModalOpen(true);
    } catch (err) {
      console.error('Failed to load user details:', err);
      toast.error('Could not retrieve user details.');
    } finally {
      setLoadingDetail(false);
    }
  };

  /**
   * Handles the promote event.
   */
  const handlePromote = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/admin/users/${id}/promote-moderator`);
      toast.success('User promoted to Moderator successfully!');
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Promotion failed.');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handles the demote event.
   */
  const handleDemote = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/admin/users/${id}/demote-moderator`);
      toast.success('Moderator demoted successfully!');
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Demotion failed.');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Handles the delete event.
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account? This action cannot be undone.')) {
      return;
    }
    setActionLoading(true);
    try {
      const deleteUrl = currentUser.role === 'admin' ? `/admin/users/${id}` : `/moderator/users/${id}`;
      await api.delete(deleteUrl);
      toast.success('User account deleted successfully.');
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deletion failed.');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * getRoleBadgeColor utility/helper function.
   */
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/15 text-red-400 border border-red-500/20';
      case 'store_owner':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/20';
      case 'moderator':
        return 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20';
      default:
        return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20';
    }
  };

  /**
   * getRoleLabel utility/helper function.
   */
  const getRoleLabel = (role) => {
    if (role === 'store_owner') return 'Owner';
    if (role === 'admin') return 'Admin';
    if (role === 'moderator') return 'Moderator';
    return 'Rater';
  };

  /**
   * canDelete utility/helper function.
   */
  const canDelete = (u) => {
    if (!u) return false;
    if (u.id === currentUser.id) return false;
    if (currentUser.role === 'admin') {
      return u.role !== 'admin';
    }
    if (currentUser.role === 'moderator') {
      return u.role === 'user' || u.role === 'store_owner';
    }
    return false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">👥</span>
            Users Registry
          </h1>
          <p className="text-slate-400 text-sm mt-1">{users.length} users registered on the platform</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={fetchUsers}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all outline-none"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          {currentUser.role === 'admin' && (
            <Link
              to="/admin/add-user"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold gradient-button"
            >
              <Plus size={16} />
              <span>Add User</span>
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5 border-slate-800/80 mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            className="w-full pl-10 pr-4 py-2 glass-input text-slate-200 text-sm"
            placeholder="Search by email..."
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
        <div>
          <select
            className="w-full px-3 py-2 glass-input text-slate-200 text-sm cursor-pointer"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">Rater</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl border-slate-800/80 overflow-hidden shadow-xl">
        {loading && users.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-violet-500" size={32} />
            <p className="text-slate-400 text-sm">Loading users list...</p>
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
                      <span>Name</span>
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
                    onClick={() => handleSort('role')}
                    className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>Role</span>
                      <SortIcon field="role" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Status / Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                <AnimatePresence>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-550 text-sm">
                        No users match the search filters.
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-200 flex items-center gap-2">
                          <span>{u.name}</span>
                          {u.requestedModerator && (
                            <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[9px] font-bold border border-violet-500/30 animate-pulse">
                              REQ MOD
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                          {u.location || u.address || <span className="text-slate-700 italic">No address/location</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleBadgeColor(u.role)}`}>
                            {getRoleLabel(u.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => viewUserDetail(u.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-violet-400 hover:text-violet-300 hover:bg-slate-800 hover:border-slate-700 transition-all outline-none"
                          >
                            <Eye size={13} />
                            <span>View / Manage</span>
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

      {/* User Detail Dialog */}
      <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 animate-in fade-in duration-100" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 outline-none text-slate-100">
            <div className="flex justify-between items-center mb-6">
              <Dialog.Title className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <User size={18} className="text-violet-500" />
                User Details & Actions
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800 outline-none">
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>

            {selectedUser && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Name</label>
                    <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</label>
                    <div className="mt-0.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor(selectedUser.role)}`}>
                        {getRoleLabel(selectedUser.role)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <p className="text-xs text-slate-300 font-medium mt-0.5 truncate">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Phone size={10} />
                      Phone Number
                    </label>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      {selectedUser.phone || <span className="text-slate-700 italic">Not provided</span>}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <MapPin size={10} />
                      Location
                    </label>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">
                      {selectedUser.location || <span className="text-slate-700 italic">Not provided</span>}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Address</label>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed truncate">
                      {selectedUser.address || <span className="text-slate-700 italic">Not provided</span>}
                    </p>
                  </div>
                </div>

                {selectedUser.storeDescription && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <FileText size={10} />
                      Store Description
                    </label>
                    <p className="text-xs text-slate-300 mt-0.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-850/60 max-h-24 overflow-y-auto leading-relaxed">
                      {selectedUser.storeDescription}
                    </p>
                  </div>
                )}

                {selectedUser.role === 'store_owner' && (
                  <div className="border-t border-slate-800/80 pt-4 mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Stores Performance
                      </label>
                      <div className="flex items-center gap-1.5">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-extrabold text-amber-400">
                          {selectedUser.rating !== null ? Number(selectedUser.rating).toFixed(1) : '0.0'}
                        </span>
                        <span className="text-[10px] text-slate-500">(Avg)</span>
                      </div>
                    </div>
                    
                    {selectedUser.stores && selectedUser.stores.length > 0 ? (
                      <div className="max-h-24 overflow-y-auto space-y-2 pr-1">
                        {selectedUser.stores.map((store) => (
                          <div key={store.id} className="flex justify-between items-center bg-slate-950/40 border border-slate-850 p-2 rounded-lg text-xs">
                            <span className="font-semibold text-slate-300">{store.name}</span>
                            <span className="text-amber-400 font-extrabold flex items-center gap-0.5">
                              ★ {store.averageRating !== null ? Number(store.averageRating).toFixed(1) : '0.0'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 italic">No stores assigned to this owner yet.</p>
                    )}
                  </div>
                )}

                {/* Management Actions */}
                <div className="border-t border-slate-800/80 pt-4 mt-4 space-y-3">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Management Actions
                  </label>
                  
                  {selectedUser.requestedModerator && currentUser.role === 'admin' && (
                    <div className="bg-violet-500/10 border border-violet-500/20 p-2.5 rounded-xl flex items-start gap-2.5 mb-2">
                      <ShieldAlert size={16} className="text-violet-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-violet-300">Upgrade Requested</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">This user requested to be upgraded to Moderator.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {/* Admin Promote/Demote Actions */}
                    {currentUser.role === 'admin' && selectedUser.role === 'user' && (
                      <button
                        onClick={() => handlePromote(selectedUser.id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors outline-none flex items-center gap-1 shadow-md shadow-violet-600/10"
                      >
                        {selectedUser.requestedModerator ? 'Accept Moderator Upgrade' : 'Promote to Moderator'}
                      </button>
                    )}
                    {currentUser.role === 'admin' && selectedUser.role === 'moderator' && (
                      <button
                        onClick={() => handleDemote(selectedUser.id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors outline-none flex items-center gap-1"
                      >
                        Demote to Rater
                      </button>
                    )}

                    {/* Delete Action (Admin/Moderator) */}
                    {canDelete(selectedUser) && (
                      <button
                        onClick={() => handleDelete(selectedUser.id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 bg-red-650 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors outline-none flex items-center gap-1 shadow-md shadow-red-600/10"
                      >
                        <Trash2 size={13} />
                        Delete User Account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors outline-none">
                  Close Detail
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default AdminUsers;
