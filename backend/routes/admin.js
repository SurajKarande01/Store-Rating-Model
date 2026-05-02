const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getDashboard,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
} = require('../controllers/adminController');
const { userValidationRules, storeValidationRules } = require('../middleware/validators');

// All admin routes require authentication + admin role
router.use(authenticate, authorize('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', getDashboard);

// POST /api/admin/users - Create user
router.post('/users', userValidationRules, createUser);

// GET /api/admin/users - List users with filters
router.get('/users', getUsers);

// GET /api/admin/users/:id - Get user details
router.get('/users/:id', getUserById);

// POST /api/admin/stores - Create store
router.post('/stores', storeValidationRules, createStore);

// GET /api/admin/stores - List stores with filters
router.get('/stores', getStores);

module.exports = router;
