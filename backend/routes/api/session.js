const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { setTokenCookie, restroreUser, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

// router for all routes beginning with /api/session (already handled by routers above this one, so just / in relation this router)

// route used to get a session - will be a GET request
// connect the restoreUser middleware which checks for a user session token and puts the corresponding user on the req object
router.get('/', restoreUser, (req, res) => {
    // attempt to destructure the user from the req object
    const { user } = req;
    // if the user exist return the user in json format
    if(user){
        return res.json({user: user.toSafeObject()});
    }
    // if user doesn't exist return an empty object in json format
    else{
        return res.json({});
    }
});

// route used for logging in - will be POST request
router.post('/',
    asyncHandler(async (req, res, next) => {
        // destructure the credential & password from the request body
        const { credential, password } = req.body;

        // attempt to find hte user with those credentials
        const user = await User.login({credential, password});

        // if there's no matching user create an error and send it to the next error handling middleware
        if(!user){
            const err = new Error('Login failed');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = ['The provided credentials were invalid.'];
            return next(err);
        }

        // provided user was found we need to set the session token cookie
        await setTokenCookie(res, user);

        // then send the response with the logged in user info
        return res.json({user});
    })
);

// route used for logging out - will be DELETE request
router.delete('/', (_req, res) => {
    // when a user logs out we want to remove the session token cookie and then send a success response
    res.clearCookie('token');
    return res.json({message: 'success'});
})

module.exports = router;
