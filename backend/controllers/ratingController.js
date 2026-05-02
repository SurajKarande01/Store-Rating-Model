const { validationResult } = require('express-validator');
const pool = require('../config/db');

/**
 * POST /api/ratings - Submit a new rating
 */
const submitRating = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const [stores] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (stores.length === 0) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    // Check if user already rated this store
    const [existingRating] = await pool.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );

    if (existingRating.length > 0) {
      return res.status(409).json({ message: 'You have already rated this store. Use update instead.' });
    }

    // Insert rating
    const [result] = await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [userId, storeId, rating]
    );

    res.status(201).json({ message: 'Rating submitted successfully.', ratingId: result.insertId });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * PUT /api/ratings/:id - Update an existing rating
 */
const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const rating = parseInt(req.body.rating, 10);

    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Check if rating exists and belongs to user
    const [existing] = await pool.query(
      'SELECT id FROM ratings WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Rating not found or not authorized.' });
    }

    await pool.query('UPDATE ratings SET rating = ? WHERE id = ?', [rating, id]);

    res.json({ message: 'Rating updated successfully.' });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { submitRating, updateRating };
