const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const config = require('../config/config');

/**
 *  @description : Check for authorized user
 */
exports.protectRoutes = asyncHandler( async (req, res, next)=>{
    let token;
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.token){
        token = req.cookies.token
    }
    // Make sure token exists
    if(!token){
        return next(new ErrorResponse(`Not Authorized To access this route`, 401));
    }
    try{
        const decode = jwt.verify(token, config.config.JWT_SECRET_KEY);
        req.user = await User.findById(decode.id);
        next();
    }catch(err){
        return next(new ErrorResponse(`Not Authorized To access this route`, 401));
    }
})

