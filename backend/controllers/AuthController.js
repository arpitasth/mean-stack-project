const User = require('../models/User');
const config = require('../config/config');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 *  @param {Object} req The request Object
 *  @param {Object} res The response Object
 *  @param {function} next The callback to the next program handler
 *  @description: Register the new User
 */
exports.registerUser = asyncHandler(async (req, res, next)=> {
    const { name, email, password, role } = req.body;
    // create User
    const user =  await User.create(req.body);
    sendTokenResponse(user, 200, res);
})

/**
 *  @param {Object} req The request Object
 *  @param {Object} res The response Object
 *  @param {function} next The callback to the next program handler
 *  @description: Login for thr User
 */
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

/**
 *  @param {Object} req The request Object
 *  @param {Object} res The response Object
 *  @param {function} next The callback to the next program handler
 *  @description: Logout the  User
 */
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


/**
 *  @description: Helper function to send the response
 */
const sendTokenResponse = (user, statusCode, res) => {
    // Create Token
    const token = user.getSignedJwtToken();
    const options = {
        expiresIn: Date.now() + config.config.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
    const decode = jwt.verify(token, config.config.JWT_SECRET_KEY);
    return res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        token,
        user:decode.id,
        expiresIn:config.config.JWT_EXPIRE
    });
}

