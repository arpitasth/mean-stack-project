const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
// const sendEmail = require('../utils/sendEmail');
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

// @desc:       Get Current User
// @route:      GET api/v1/auth/me
// @access:     Private
exports.getCurrentUser = asyncHandler(async (req, res, next)=> {
   const user = await User.findById(req.user.id);

   res.status(200).json({
    success: true,
    data: user
   })
})


// @desc:       Update Current User
// @route:      PUT api/v1/auth/me
// @access:     Private
exports.updateCurrentUserDetails = asyncHandler(async (req, res, next)=> {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
     success: true,
     data: user
    })
 })

 // @desc:       Update Current User Password
// @route:       PUT api/v1/auth/user-password
// @access:     Private
exports.updateCurrentPassword = asyncHandler(async (req, res, next)=> {
    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse(`Password Is Incorrect`, 404));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
 })

// @desc:       Forgot Password
// @route:      GET api/v1/auth/forgot-password
// @access:     Public
exports.getForgotPassword = asyncHandler(async (req, res, next)=> {
    const user = await User.findOne({ email: req.body.email });

    if(!user){
        return next(new ErrorResponse(`No User Exists with that Email`, 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false })

    // create Reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;

    const message = `You are receiving this email because you Or someone else has requested to reset
    the password. Please make a PUT request to ${resetUrl}`;

    try{
        // await sendEmail({
        //     email: user.email,
        //     subject: 'Password Reset E-Mail Sent!!',
        //     message
        // })

        // return res.status(200).json({
        //     success: true,
        //     data: 'Email Sent'
        // })
    }catch(err){
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiration = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse(`Email Could Not be send`, 500));
    }

 });

 // @desc:       Reset Password By Token
// @route:      PUT /api/v1/resetPassword/:resetPasswordToken
// @access:     Public
exports.resetPassword = asyncHandler(async (req, res, next)=> {
    let resetToken =  req.params.resetPasswordToken;
    let resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpiration: { $gt:Date.now() }
    });

    if(!user){
        return next(new ErrorResponse(`Invalid Token`, 400));
    }

    // Set new Password
    user.password = req.body.password,
    user.resetPasswordToken = undefined ;
    user.resetPasswordExpiration = undefined;

    await user.save();

    sendTokenResponse(user, 200, res);
});


// Get Token from Model & Store it in Cookie
const sendTokenResponse = (user, statusCode, res) => {

    /// Create Token
    const token = user.getSignedJwtToken();
    const JWT_SECRET='hhavsfhfybnqwgeu61t76587yq3ekgukagbduit'
    const JWT_EXPIRE='30d'
    const JWT_COOKIE_EXPIRE='30'
    const options = {
        expiresIn: Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        httpOnly: true
    }

    return res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
        success: true,
        token
    });
}

