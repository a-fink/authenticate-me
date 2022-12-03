const express = require('express');
const router = express.Router();

// create and export a test route
// set a cookie on the response with a name of XSRF-TOKEN and give it the value of the method we set up wtih csrf middleware before
router.get('/hello/world', function(req, res){
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.send('Hello World!');
});

module.exports = router;
