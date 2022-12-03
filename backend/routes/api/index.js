// backend/routes/api/index.js
const router = require('express').Router();

// test router for this router
router.post('/test', function(req, res) {
    res.json({requestBody: req.body});
});

module.exports = router;
