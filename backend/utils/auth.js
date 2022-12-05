const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// function to set JWT cookie once successful login / signup
// inputs - response object from express, user that was found
// returns - the JWT cookie
const setTokenCookie = (res, user) => {
    // create a token
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: parseInt(expiresIn)}
    );

    // confirm which environment we are in
    const isProduction = process.env.NODE_ENV === 'production';

    // set the cookie token
    res.cookie('token', token, {
        maxAge: expiresIn * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
}

// middleware to restore session user based on contents of JWT cookie set upon login/signup - so authenticated routes can confirm identity of the current user
// inputs - express request, response, and next variables
// returns - a call to the next middleware
const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        // if there's already an error, just return call to next middleware
        if(err){
            return next();
        }

        // try to get id from payload and find a matching user - use currentUser scope because password not needed here
        try{
            const { id } = jwtPayload.data;
            req.user = await User.scope('currentUser').findByPk(id);
        }
        // if there's an error clear the token from the cookies in response and call next middleware
        catch(e){
            res.clearCookie('token');
            return next();
        }

        // when we tried to find user above, if no matching user, req.user will be null - in this case should also clear the token from the response cookies
        if(!req.user) res.clearCookie('token');

        return next();
    });
}

// middleware to use for protected routes - will require an authenticated session user to view these routes
// this variable will hold array of functions, first is the restore user we built above, to try and get authenticated user from cookies
// second function will pass the request to the next middleware if a user was found, or pass an error to the error handlers if no user found
const requireAuth = [
    restoreUser,
    function (req, _res, next){
        if(req.user) return next();

        const err = new Error('Unauthorized');
        err.title = 'Unauthorized';
        err.errors = ['Unauthorized'];
        return next(err);
    }
];

module.exports = { setTokenCookie, restoreUser, requireAuth };
