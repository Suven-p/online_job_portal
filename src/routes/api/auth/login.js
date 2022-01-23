const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post(
    '/',
    passport.authenticate('local', {
        successRedirect: '/api/userinfo',
        failureRedirect: '/api/auth/failed',
        failureMessage: true,
    })
);

module.exports = router;
