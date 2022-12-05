const { validationResult } = require('express-validator');

// middleware for formatting errors from express validator middleware
// we will use the built in validationResult method from express-validator for this
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    // if there are validation errors, make an error object, and put all errors into it's errors property, then call next error handler
    if(!validationErrors.isEmpty()){
        const errors = validationErrors.array().map((error) => `${error.msg}`);

        const err = Error('Bad request.');
        err.errors = errors;
        err.status = 400;
        err.title = 'Bad request.';
        next(err);
    }

    // otherwise if no validation errors occured, just call the next middleware
    next();
}

module.exports = { handleValidationErrors };
