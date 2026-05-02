const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { changePassword } = require('../controllers/userController');
const { passwordValidationRules } = require('../middleware/validators');

// PUT /api/users/password - Change password (all authenticated users)
router.put('/password', authenticate, passwordValidationRules, changePassword);

module.exports = router;
