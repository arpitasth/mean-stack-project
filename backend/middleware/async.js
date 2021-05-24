/**
* Async Handler is used to handle every single error.It's an alternative of try catch block
*/
const asyncHandler = fn => (req, res, next) =>
    Promise
    .resolve(fn(req, res, next))
    .catch(next)

module.exports = asyncHandler;
