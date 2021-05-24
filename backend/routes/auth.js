const express = require('express');

const router = express.Router();

// Load Controller
const {
    registerUser,
    loginUser,
    getCurrentUser,
    getForgotPassword,
    resetPassword,
    updateCurrentUserDetails,
    updateCurrentPassword,
    logout
} = require('../controllers/AuthController');

// Protect Routes
const { protectRoutes } = require('../middleware/auth');

router
    .route('/register')
    .post(registerUser);

router
    .route('/login')
    .post(loginUser);


module.exports  = router;
