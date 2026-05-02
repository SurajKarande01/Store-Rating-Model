const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getAllStores } = require('../controllers/storeController');

// GET /api/stores - Normal users can view all stores with ratings
router.get('/', authenticate, authorize('user'), getAllStores);

module.exports = router;
