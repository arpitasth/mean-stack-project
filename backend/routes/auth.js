const express = require('express');
const router = express.Router();

// Load Controller
const {
    registerUser,
    loginUser
} = require('../controllers/AuthController');

/**
 *  Routes For register & login the user
 */
router
    .route('/register')
    .post(registerUser);

router
    .route('/login')
    .post(loginUser);

module.exports  = router;
