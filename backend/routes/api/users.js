const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// router for all routes beginning with /api/users (already handled by routers above this one, so just / in relation this router)

// middleware to validate information coming in on the request body for creating a user
// using built in check function from express-validator, and the error handler for validation errors we built
// check for given conditions, and respond with given error message if fails, then send results to the handleValidationErrors middleware
const validateSignup = [
    check('email').exists({checkFalsy: true}).isEmail().withMessage('Please provide a valid email'),
    check('username').exists({checkFalsy: true}).isLength({min: 4}).withMessage('Please provide a username with at least 4 characters.'),
    check('username').not().isEmail().withMessage('Username cannot be an email.'),
    check('password').exists({checkFalsy: true}).isLength({min: 6}).withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// route for creating a new user - will be a POST request
// adding validateSignup middleware as a parameter here to connect the middleware
router.post('/',
    validateSignup,
    asyncHandler(async (req, res) => {
        // destructure the user information from the request body
        const { email, password, username } = req.body;

        // attempt to create a new user in the database with the information
        // if this is unsuccessful a sequelize validation error will be automatically passed to the next error handling middleware for us
        const user = await User.signup({email, username, password});

        // provided no error resulted and user has been created, set the session token for the user
        setTokenCookie(res, user);

        // if all successful send a response with the created user data
        return res.json({user});
    })
);

module.exports = router;
