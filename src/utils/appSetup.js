const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const logger = require('../middleware/logger');
const passportSetup = require('./passportSetup');
const dbConnection = require('./dbSetup');

const appSetup = (app) => {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const sess = {
        secret: process.env.SESSION_SECRET,
        name: 'sessionId',
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            secure: app.get('env') === 'production',
            httpOnly: true,
        },
        resave: false,
        saveUninitialized: true,
    };
    app.set('trust proxy', 1);
    if (!process.env.SESSION_SECRET) {
        console.error('No session secret set!');
        process.exit(1);
    }

    app.use(session(sess));

    passportSetup(passport);
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(morgan('dev'));
    app.use(logger);

    dbConnection.ping(function (err) {
        if (err) {
            throw err;
        }
        console.log('Server responded to ping');
    });
};

module.exports = appSetup;
