const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { submitRating, updateRating } = require('../controllers/ratingController');
const { ratingValidationRules } = require('../middleware/validators');

// POST /api/ratings - Submit a rating (normal users only)
router.post('/', authenticate, authorize('user'), ratingValidationRules, submitRating);

// PUT /api/ratings/:id - Update a rating (normal users only)
router.put('/:id', authenticate, authorize('user'), updateRating);

module.exports = router;
