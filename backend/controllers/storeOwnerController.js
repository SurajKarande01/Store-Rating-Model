const pool = require('../config/db');

/**
 * GET /api/store-owner/dashboard - Get store owner dashboard data
 */
const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Get store(s) owned by this user
    const [stores] = await pool.query(
      'SELECT id, name, email, address FROM stores WHERE owner_id = ?',
      [ownerId]
    );

    if (stores.length === 0) {
      return res.json({ stores: [], averageRating: 0, raters: [] });
    }

    const storeIds = stores.map((s) => s.id);

    // Get average rating across all owned stores
    const [avgResult] = await pool.query(
      `SELECT COALESCE(AVG(rating), 0) as averageRating, COUNT(*) as totalRatings 
       FROM ratings WHERE store_id IN (?)`,
      [storeIds]  // mysql2 handles array expansion for IN clause automatically
    );

    // Get list of users who rated their store(s)
    const [raters] = await pool.query(
      `SELECT u.id, u.name, u.email, r.rating, r.created_at, r.updated_at, s.name as storeName
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       JOIN stores s ON r.store_id = s.id
       WHERE r.store_id IN (?)
       ORDER BY r.created_at DESC`,
      [storeIds]  // mysql2 handles array expansion for IN clause automatically
    );

    res.json({
      stores,
      averageRating: parseFloat(avgResult[0].averageRating).toFixed(1),
      totalRatings: avgResult[0].totalRatings,
      raters,
    });
  } catch (error) {
    console.error('Store owner dashboard error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getOwnerDashboard };
