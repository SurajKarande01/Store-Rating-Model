const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getOwnerDashboard } = require('../controllers/storeOwnerController');

// GET /api/store-owner/dashboard - Store owner dashboard
router.get('/dashboard', authenticate, authorize('store_owner'), getOwnerDashboard);

module.exports = router;
