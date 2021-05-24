const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect Routes
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
        const JWT_SECRET='hhavsfhfybnqwgeu61t76587yq3ekgukagbduitkjgfuyatn'
        const decode = jwt.verify(token, JWT_SECRET);
        console.log(decode);
        req.user = await User.findById(decode.id);
        next();
    }catch(err){
        return next(new ErrorResponse(`Not Authorized To access this route`, 401));
    }
})

