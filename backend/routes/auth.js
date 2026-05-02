const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const { userValidationRules } = require('../middleware/validators');

// POST /api/auth/signup - Normal user registration
router.post('/signup', userValidationRules, signup);

// POST /api/auth/login - Login for all roles
router.post('/login', login);

module.exports = router;
