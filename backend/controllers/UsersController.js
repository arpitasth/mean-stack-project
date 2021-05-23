const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc:       Get All Users
// @route:      GET api/v1/auth/users
// @access:     Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next)=> {
    const user = await User.find();

    res.status(200).json({
        success: true,
        message: "All Users Fetched Successfully!!",
        count: user.length,
        data: user
    })
})

// @desc:       Get Single Users
// @route:      GET api/v1/auth/users/:id
// @access:     Private/Admin
exports.getSingleUser = asyncHandler(async (req, res, next)=> {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        message: "User Fetched Successfully!",
        data: user
    })
})

// @desc:       Create User
// @route:      POST api/v1/auth/users
// @access:     Private/Admin
exports.createUser = asyncHandler(async (req, res, next)=> {
    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
        message: "User Created Successfully!",
        data: user
    })
})

// @desc:       Update User
// @route:      PUT api/v1/auth/users/:id
// @access:     Private/Admin
exports.updateUser = asyncHandler(async (req, res, next)=> {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!user){
        return next(new ErrorResponse(`User Not Found`, 400));
    }

    res.status(200).json({
        success: true,
        message: "User Updated Successfully!",
        data: user
    })
})

// @desc:       Delete User
// @route:      DELETE api/v1/auth/users/:id
// @access:     Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next)=> {
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){
        return next(new ErrorResponse(`User Not Found`, 400));
    }

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully!"
    })
})
