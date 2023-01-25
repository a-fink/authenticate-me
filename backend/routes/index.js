const express = require('express');
const router = express.Router();

// import individual routers
const apiRouter = require('./api');

// connect the apiRouter
router.use('/api', apiRouter);

// static routes - will serve static React build files when in production
if(process.env.NODE_ENV === 'production'){

    // import the path functionality to resolve file path
    const path = require('path');

    // serve frontend's index.htm file at the root route & send the XSRF-TOKEN
    router.get('/', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.sendFile(path.resolve(__dirname, '../../frontend', 'build', 'index.html'));
    });

    // serve the static assets in the frontend's build folder
    router.use(express.static(path.resolve("../frontend/build")));

    // serve frontend's index.html file at all other routes that DON'T start with /api & send XSRF-TOKEN same way we did above for root route
    router.get(/^(?!\/?api).*/, (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.sendFile(path.resolve(__dirname, '../../frontend', 'build', 'index.html'));
    });
}

// route to add XSRF-TOKEN cookie when in DEVELOPMENT (necessary because in development front/back are two separate servers)
if(process.env.NODE_ENV !== 'production') {
    router.get('/api/csrf/restore', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.status(201).json({});
    })
}

module.exports = router;

/*
TEST ROUTE TO MAKE SURE SERVER UP - ALL WORKING NOW - KEEPING IN CASE NEED LATER FOR MORE TESTING
// create a test route
// set a cookie on the response with a name of XSRF-TOKEN and give it the value of the method we set up wtih csrf middleware before
router.get('/hello/world', function(req, res){
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
});
*/
