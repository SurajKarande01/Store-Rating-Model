import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import StarRating from '../components/StarRating';

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
    } finally {
      setLoading(false);
    }
  }, [search, sortBy, sortOrder]);

  useEffect(() => { fetchStores(); }, [fetchStores]);

  const handleRate = async (storeId, rating, existingRatingId) => {
    try {
      if (existingRatingId) {
        await api.put(`/ratings/${existingRatingId}`, { rating });
        toast.success('Rating updated!');
      } else {
        await api.post('/ratings', { storeId, rating });
        toast.success('Rating submitted!');
      }
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating');
    }
  };

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
      <div className="dashboard-header">
        <h1>🏪 Browse Stores</h1>
        <p>Rate and review your favorite stores</p>
      </div>

      <div className="filters-bar">
        <input className="form-input" placeholder="Search by name..." value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })} />
        <input className="form-input" placeholder="Search by address..." value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })} />
        <button className="btn btn-secondary" onClick={() => { fetchStores(); }}>Search</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Store Name <SortIcon field="name" /></th>
                <th onClick={() => handleSort('address')}>Address <SortIcon field="address" /></th>
                <th onClick={() => handleSort('overallRating')}>Overall Rating <SortIcon field="overallRating" /></th>
                <th>Your Rating</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 ? (
                <tr><td colSpan="5"><div className="empty-state"><div className="empty-icon">🏪</div><p>No stores found</p></div></td></tr>
              ) : stores.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</td>
                  <td>
                    <div className="rating-display">
                      <StarRating rating={Math.round(Number(s.overallRating))} readonly size="1rem" />
                      <span className="rating-value">{Number(s.overallRating).toFixed(1)}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({s.totalRatings})</span>
                    </div>
                  </td>
                  <td>
                    {s.userRating ? (
                      <div className="rating-display">
                        <StarRating rating={s.userRating} readonly size="1rem" />
                        <span className="rating-value">{s.userRating}</span>
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Not rated</span>
                    )}
                  </td>
                  <td>
                    <StarRating
                      rating={s.userRating || 0}
                      onRate={(rating) => handleRate(s.id, rating, s.userRatingId)}
                      size="1.2rem"
                    />
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

export default UserStores;
