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

router
    .route('/logout')
    .get(logout);

router
    .route('/me')
    .get(protectRoutes, getCurrentUser)
    .put(protectRoutes, updateCurrentUserDetails);

router
    .route('/me/user-password')
    .put(protectRoutes, updateCurrentPassword);

router
    .route('/forgot-password')
    .post(getForgotPassword);

router
    .route('/resetPassword/:resetPasswordToken')
    .put(resetPassword);

module.exports  = router;
