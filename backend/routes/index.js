const express = require('express');
const router = express.Router();

// import individual routers
const apiRouter = require('./api');

// connect the apiRouter
router.use('/api', apiRouter);

// create a test route
// set a cookie on the response with a name of XSRF-TOKEN and give it the value of the method we set up wtih csrf middleware before
router.get('/hello/world', function(req, res){
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
});

module.exports = router;
