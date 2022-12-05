const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

// router for all routes beginning with /api/users

// route for creating a new user - will be a POST request to the /api/users route (already handled by routers above this one, so just / in relation this router)
router.post('/',
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
