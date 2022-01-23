const express = require('express');
const googleHandler = require('./google');
const localLoginHandler = require('./login');
const localRegisterHandler = require('./register');

const router = express.Router();

router.use('/google', googleHandler);
router.use('/login', localLoginHandler);
router.use('/register', localRegisterHandler);

router.get(
    '/failed',
    (req, res) => {
        return res.json({
            message: 'Failed to authenticate', log: req.session.messages, success: false,
        });
    }
);

router.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logout successful!', success: true });
});

module.exports = router;
