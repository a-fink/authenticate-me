// backend/routes/api/index.js
const router = require('express').Router();
const asyncHandler = require('express-async-handler');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

/*
TEST ROUTES - ALL WORKING NOW - KEEPING TESTS IN CASE NEEDED IN FUTURE
// route to test the setTokenCookie function
router.get('/set-token-cookie', asyncHandler(async (_req, res) => {
    const user = await User.findOne({
        where: {
            username: 'Demo-lition'
        }
    });
    setTokenCookie(res, user);
    return res.json({ user });
}));

// route to test the restoreUser middleware
router.get('/restore-user', restoreUser, (req, res) => {
    return res.json(req.user);
});

// route to test the requireAuth middleware
router.get('/require-auth', requireAuth, (req, res) => {
    return res.json(req.user);
});

// test router for this router
router.post('/test', function(req, res) {
    res.json({requestBody: req.body});
});
*/

module.exports = router;
