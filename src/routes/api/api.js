const express = require('express');
const isLoggedIn = require('../../middleware/isLoggedIn');
const connection = require('../../utils/dbSetup');

const router = express.Router();

router.use('/test', (req, res, next) => {
    connection.query(
        'SELECT * from test',
        function (err, data, fields) {
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Something went wrong!', success: false });
            } else {
                console.log(data);
                res.status(200).send({ data, success: true });
            }
        }
    );
});

router.get('/connection', (req, res) => {
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const { ip } = req;
    const userAgent = req.get('user-agent');
    const cookies = req.session;
    res.json({
        url, ip, userAgent, cookies, envPort: process.env.PORT || 'unknown', success: true,
    });
});

router.get('/userinfo', isLoggedIn, (req, res) => {
    res.json({ user: req.user });
});

router.use('/auth', require('./auth/auth'));

router.get('/', (req, res) => {
    res.json({ message: 'This is the api page!', success: true });
});

module.exports = router;
