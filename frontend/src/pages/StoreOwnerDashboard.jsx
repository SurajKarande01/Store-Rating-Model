import { useState, useEffect } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';

const StoreOwnerDashboard = () => {
  const [data, setData] = useState({ stores: [], averageRating: 0, totalRatings: 0, raters: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: dashData } = await api.get('/store-owner/dashboard');
        setData(dashData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="loading-page"><div className="spinner"></div></div>;

  return (
    <div className="page-content">
      <div className="dashboard-header">
        <h1>🏪 Store Dashboard</h1>
        <p>Your store performance overview</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{data.averageRating}</div>
          <div className="stat-label">Average Rating</div>
          <div style={{ marginTop: '0.5rem' }}>
            <StarRating rating={Math.round(Number(data.averageRating))} readonly />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{data.totalRatings}</div>
          <div className="stat-label">Total Ratings Received</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏬</div>
          <div className="stat-value">{data.stores?.length || 0}</div>
          <div className="stat-label">Your Stores</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>👥 Users Who Rated Your Store</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Store</th>
                <th>Rating</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.raters?.length === 0 ? (
                <tr><td colSpan="5"><div className="empty-state"><div className="empty-icon">📭</div><p>No ratings yet</p></div></td></tr>
              ) : data.raters?.map((r, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td>{r.email}</td>
                  <td>{r.storeName}</td>
                  <td>
                    <div className="rating-display">
                      <StarRating rating={r.rating} readonly size="1rem" />
                      <span className="rating-value">{r.rating}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {new Date(r.created_at).toLocaleDateString()}
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

export default StoreOwnerDashboard;
