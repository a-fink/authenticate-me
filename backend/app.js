const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const { ValidationError } = require('sequelize');

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

// error handling middleware - catch unhandled request, set some information, and forward to error handler
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = ["The requested resource couldn't be found."];
  err.status = 404;
  next(err);
});

// error handler middleware for sequelize errors - catch and format error before sending response
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error - only want to use this formatting if it is, otherwise fall through to other handlers down the line
  if(err instanceof ValidationError){
    err.errors = err.errors.map((e) => e.message);
    err.title = 'Validation error';
  }
  next(err);
});

// error handler - final formatting for all errors before sending back a json response
// status / title will be set to the error's values if present, or 500 / server error otherwise
// stack will send back the error stack trace if we're in dev or null if in production
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  });
});


// export the app for use elsewhere
module.exports = app;
