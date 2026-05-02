const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const pool = require('../config/db');

/**
 * GET /api/admin/dashboard - Get dashboard statistics
 */
const getDashboard = async (req, res) => {
  try {
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [storeCount] = await pool.query('SELECT COUNT(*) as count FROM stores');
    const [ratingCount] = await pool.query('SELECT COUNT(*) as count FROM ratings');

    res.json({
      totalUsers: userCount[0].count,
      totalStores: storeCount[0].count,
      totalRatings: ratingCount[0].count,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * POST /api/admin/users - Create a new user (admin can create any role)
 */
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, role } = req.body;
    const validRoles = ['admin', 'user', 'store_owner'];
    const userRole = validRoles.includes(role) ? role : 'user';

    // Check if email already exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, passwordHash, address || '', userRole]
    );

    res.status(201).json({ message: 'User created successfully.', userId: result.insertId });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * GET /api/admin/users - List users with optional filters and sorting
 */
const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;

    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
             CASE WHEN u.role = 'store_owner' THEN (
               SELECT COALESCE(AVG(r.rating), 0) FROM ratings r 
               JOIN stores s ON r.store_id = s.id 
               WHERE s.owner_id = u.id
             ) ELSE NULL END as rating
      FROM users u WHERE 1=1
    `;
    const params = [];

    if (name) {
      query += ' AND u.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND u.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND u.address LIKE ?';
      params.push(`%${address}%`);
    }
    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }

    // Sorting
    const allowedSortFields = ['name', 'email', 'address', 'role', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY u.${sortField} ${order}`;

    const [users] = await pool.query(query, params);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * GET /api/admin/users/:id - Get user details
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      `SELECT u.id, u.name, u.email, u.address, u.role, u.created_at FROM users u WHERE u.id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];

    // If store owner, include their store rating
    if (user.role === 'store_owner') {
      const [stores] = await pool.query(
        `SELECT s.id, s.name, COALESCE(AVG(r.rating), 0) as averageRating
         FROM stores s 
         LEFT JOIN ratings r ON r.store_id = s.id 
         WHERE s.owner_id = ? 
         GROUP BY s.id, s.name`,
        [id]
      );
      user.stores = stores;
      user.rating = stores.length > 0 ? stores[0].averageRating : 0;
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * POST /api/admin/stores - Create a new store
 */
const createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, ownerId } = req.body;

    // Check if store email already exists
    const [existing] = await pool.query('SELECT id FROM stores WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Store email already registered.' });
    }

    // If ownerId provided, verify the user is a store_owner
    if (ownerId) {
      const [owner] = await pool.query('SELECT id, role FROM users WHERE id = ?', [ownerId]);
      if (owner.length === 0) {
        return res.status(404).json({ message: 'Owner user not found.' });
      }
      if (owner[0].role !== 'store_owner') {
        return res.status(400).json({ message: 'Selected user is not a store owner.' });
      }
    }

    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address || '', ownerId || null]
    );

    res.status(201).json({ message: 'Store created successfully.', storeId: result.insertId });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/**
 * GET /api/admin/stores - List stores with optional filters and sorting
 */
const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, sortOrder } = req.query;

    let query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id,
             COALESCE(AVG(r.rating), 0) as rating,
             COUNT(r.id) as ratingCount
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (name) {
      query += ' AND s.name LIKE ?';
      params.push(`%${name}%`);
    }
    if (email) {
      query += ' AND s.email LIKE ?';
      params.push(`%${email}%`);
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push(`%${address}%`);
    }

    query += ' GROUP BY s.id, s.name, s.email, s.address, s.owner_id';

    // Sorting
    const allowedSortFields = ['name', 'email', 'address', 'rating'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField === 'rating' ? 'rating' : `s.${sortField}`} ${order}`;

    const [stores] = await pool.query(query, params);
    res.json(stores);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { getDashboard, createUser, getUsers, getUserById, createStore, getStores };
