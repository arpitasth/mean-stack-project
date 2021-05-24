const ErrorResponse = require('../utils/errorResponse');

/**
 * @description: Custom Error Handler used to cast all types of errors
 */
const errorHandler = (err, req, res, next)=> {
    let error = { ...err };
    error.message = err.message;
    console.log(error)
    // Mongoose Object Id
    if(err.name === 'CastError'){
        const message = `Resource not found with id: ${error.value}`
        error = new ErrorResponse(message, 404);
    }

    // Mongoose Duplicate Key
    if(err.code === 11000){
        const message = `Email already exists`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose Validation Error
    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 404);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;
