const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.json({ message: 'Login successful!', user: req.user, success: true });
    });

router.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logout successful!', success: true });
});

module.exports = router;
