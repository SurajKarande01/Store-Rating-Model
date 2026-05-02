import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StarRating from '../components/StarRating';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, sortBy, sortOrder };
      Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
      const { data } = await api.get('/admin/users', { params });
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSort = (field) => {
    if (sortBy === field) { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const handleFilter = () => { fetchUsers(); };

  const SortIcon = ({ field }) => (
    <span className="sort-icon">
      {sortBy === field ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const viewUserDetail = async (id) => {
    try {
      const { data } = await api.get(`/admin/users/${id}`);
      setSelectedUser(data);
    } catch (err) {
      console.error('Failed to load user details:', err);
    }
  };

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="page-content">
      <div className="card-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>👥 Users</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{users.length} users found</p>
        </div>
        <Link to="/admin/add-user" className="btn btn-primary">+ Add User</Link>
      </div>

      <div className="filters-bar">
        <input className="form-input" placeholder="Filter by name..." value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input className="form-input" placeholder="Filter by email..." value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input className="form-input" placeholder="Filter by address..." value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <select className="form-select" value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button className="btn btn-secondary" onClick={handleFilter}>Apply</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Name <SortIcon field="name" /></th>
                <th onClick={() => handleSort('email')}>Email <SortIcon field="email" /></th>
                <th onClick={() => handleSort('address')}>Address <SortIcon field="address" /></th>
                <th onClick={() => handleSort('role')}>Role <SortIcon field="role" /></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="5"><div className="empty-state"><p>No users found</p></div></td></tr>
              ) : users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.address}</td>
                  <td><span className={`role-badge ${u.role}`}>{u.role === 'store_owner' ? 'Owner' : u.role}</span></td>
                  <td><button className="btn btn-sm btn-secondary" onClick={() => viewUserDetail(u.id)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>User Details</h2>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div><label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Name</label><p>{selectedUser.name}</p></div>
              <div><label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Email</label><p>{selectedUser.email}</p></div>
              <div><label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Address</label><p>{selectedUser.address || '—'}</p></div>
              <div><label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Role</label><p><span className={`role-badge ${selectedUser.role}`}>{selectedUser.role}</span></p></div>
              {selectedUser.role === 'store_owner' && selectedUser.rating !== undefined && (
                <div>
                  <label style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Store Rating</label>
                  <div className="rating-display">
                    <StarRating rating={Math.round(Number(selectedUser.rating))} readonly />
                    <span className="rating-value">{Number(selectedUser.rating).toFixed(1)}</span>
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn-secondary btn-block" style={{ marginTop: '1.5rem' }} onClick={() => setSelectedUser(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
