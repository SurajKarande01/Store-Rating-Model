import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StarRating from '../components/StarRating';

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
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleSort = (field) => {
    if (sortBy === field) { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }
    else { setSortBy(field); setSortOrder('asc'); }
  };

  const SortIcon = ({ field }) => (
    <span className="sort-icon">
      {sortBy === field ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="page-content">
      <div className="card-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>🏪 Stores</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stores.length} stores registered</p>
        </div>
        <Link to="/admin/add-store" className="btn btn-primary">+ Add Store</Link>
      </div>

      <div className="filters-bar">
        <input className="form-input" placeholder="Filter by name..." value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })} />
        <input className="form-input" placeholder="Filter by email..." value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })} />
        <input className="form-input" placeholder="Filter by address..." value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })} />
        <button className="btn btn-secondary" onClick={() => { fetchStores(); }}>Apply</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Name <SortIcon field="name" /></th>
                <th onClick={() => handleSort('email')}>Email <SortIcon field="email" /></th>
                <th onClick={() => handleSort('address')}>Address <SortIcon field="address" /></th>
                <th onClick={() => handleSort('rating')}>Rating <SortIcon field="rating" /></th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 ? (
                <tr><td colSpan="4"><div className="empty-state"><p>No stores found</p></div></td></tr>
              ) : stores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</td>
                  <td>
                    <div className="rating-display">
                      <StarRating rating={Math.round(Number(s.rating))} readonly size="1rem" />
                      <span className="rating-value">{Number(s.rating).toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminStores;
