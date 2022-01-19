const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/failed',
    (req, res) => {
        console.log(req);
        return res.json({
            message: 'Failed to authenticate', log: req.session.messages, success: false,
        });
    }
);

router.get(
    '/google/callback',
    (req, res, next) => {
        passport.authenticate('google', (err, user, info) => {
            if (err || !user) {
                console.error(`Error while logging in. Error: ${err} Info: ${info}`);
                req.session.messages = info;
                return res.redirect('/failed');
            }
            req.login(user, (err) => {
                if (err) {
                    console.error('Error while logging in user', err);
                    return next(err);
                }
                return res.redirect('/api/userinfo');
            });
        })(req, res, next);
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logout successful!', success: true });
});

module.exports = router;
