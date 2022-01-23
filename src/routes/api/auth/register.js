const express = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const connection = require('../../../utils/dbSetup');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post(
    '/',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array(), success: false });
            }

            const [userData] = await connection.query(
                'SELECT * FROM users WHERE email = ?',
                [req.body.username]
            );
            if (userData.length !== 0) {
                return res
                    .status(400)
                    .json({ message: 'User is already registered', success: false });
            }

            const saltRounds = 13;
            const hash = await bcrypt.hash(req.body.password, saltRounds);
            const user = {
                uid: uuidv4(),
                email: req.body.email,
                password: hash,
                firstname: req.body.firstname || null,
                middlename: req.body.middleName || null,
                lastname: req.body.lastname || null,
                picture: req.body.picture || null,
            };
            await connection.execute(
                'INSERT INTO users ' +
            '(uid, email, password, firstname, middlename, lastname, picture) ' +
            'VALUES (?, ?, ?, ?, ?, ?, ?)',
                [...Object.values(user)]
            );
            res.json(req.body);
        } catch (err) {
            console.log('Error in registration', err);
        }
    }
);

module.exports = router;
