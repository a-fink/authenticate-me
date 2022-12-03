const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { environment } = require('./config');

// import the routes folder for all the routers we will make/use
const routes = require('./routes');

// check if we are in production or dev environment
const isProduction = environment === 'production';

// initialize express app
const app = express();

// configure express to use morgan, cookie parser, and json parser middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// security middleware - only allow cors when in development
if(!isProduction){
    app.use(cors());
}

// use helmet middleware to add headers to better secure the app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// set the _csrf token and create req.csrfToken method
// this adds a HTTP only cookie (no JS reading) to server responses & puts a method on all requests we will use later
app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
);

// connect all the routers we will create / use
app.use(routes);

// export the app for use elsewhere
module.exports = app;
