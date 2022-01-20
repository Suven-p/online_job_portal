const express = require('express');
const isLoggedIn = require('../../middleware/isLoggedIn');
const router = express.Router();

router.use('/auth', require('./auth/auth'));

router.get('/userinfo', isLoggedIn, (req, res) => {
    res.json({
        user: req.user, session: req.session, success: true,
    });
});

router.get('/', (req, res) => {
    res.json({ message: 'This is the api page!', success: true });
});

module.exports = router;
