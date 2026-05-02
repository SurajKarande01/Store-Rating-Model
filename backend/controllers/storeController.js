const pool = require('../config/db');

/**
 * GET /api/stores - List all stores with ratings (for normal users)
 */
const getAllStores = async (req, res) => {
  try {
    const { name, address, sortBy, sortOrder } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT s.id, s.name, s.email, s.address,
             COALESCE(AVG(r.rating), 0) as overallRating,
             COUNT(r.id) as totalRatings,
             (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) as userRating,
             (SELECT id FROM ratings WHERE user_id = ? AND store_id = s.id) as userRatingId
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [userId, userId];

    if (name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' GROUP BY s.id, s.name, s.email, s.address';

    // Sorting
    const allowedSortFields = ['name', 'address', 'overallRating'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
    
    if (sortField === 'overallRating') {
      query += ` ORDER BY overallRating ${order}`;
    } else {
      query += ` ORDER BY s.${sortField} ${order}`;
    }

    const [stores] = await pool.query(query, params);
    res.json(stores);
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getAllStores };
