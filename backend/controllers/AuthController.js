const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// @desc:       Register User
// @route:      POST api/v1/auth/register
// @access:     Public
exports.registerUser = asyncHandler(async (req, res, next)=> {
    const { name, email, password, role } = req.body;

    // create User
    const user =  await User.create(req.body);

    sendTokenResponse(user, 200, res);
})

// @desc:       Login User
// @route:      POST api/v1/auth/login
// @access:     Public
exports.loginUser = asyncHandler(async (req, res, next)=> {
    const { email, password } = req.body;

    // Validate Email & Password
    if(!email || !password){
        return next(new ErrorResponse(`Please Enter a Email OR Password`), 404);
    }

    // Check For User
    const user = await User.findOne({email: email}).select('+password').populate('post');

    if(!user){
        return next(new ErrorResponse(`Invalid Credentials`), 401);
    }

    const isMatch = await user.matchPassword(password);

    // Check for Password
    if(!isMatch){
        return next(new ErrorResponse(`Invalid Credentials`), 401);
    }

    sendTokenResponse(user, 200, res);
})

// @desc:       Log User Out
// @route:      GET api/v1/logout
// @access:     Public
exports.logout = asyncHandler(async (req, res, next)=> {
    res.cookie('token', 'none', {
        expiresIn: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
     success: true,
     data: {}
    })
 })


// Get Token from Model & Store it in Cookie
const sendTokenResponse = (user, statusCode, res) => {

    /// Create Token
    const token = user.getSignedJwtToken();
    const JWT_SECRET='hhavsfhfybnqwgeu61t76587yq3ekgukagbduitkjgfuyatn'
    const JWT_EXPIRE='30d'
    const JWT_COOKIE_EXPIRE='30'
    const options = {
        expiresIn: Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        httpOnly: true
    }

    const decode = jwt.verify(token, JWT_SECRET);

    return res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        token,
        user:decode.id
    });
}

