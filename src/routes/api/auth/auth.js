const express = require('express');
const googleHandler = require('./google');

const router = express.Router();

router.use('/google', googleHandler);

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
