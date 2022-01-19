const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const logger = require('../middleware/logger');
const passportSetup = require('./passportSetup');
const dbConnection = require('./dbSetup');
const MySQLStore = require('express-mysql-session')(session);

const appSetup = (app) => {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const sessionStore = new MySQLStore({}, dbConnection, (err) => {
        if (err) {
            console.error('Error setting up sessionStore', err);
        } else {
            console.log('Session store connected!');
        }
    });
    const sess = {
        name: 'sessionId',
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: sessionStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            secure: app.get('env') === 'production',
            httpOnly: true,
            // sameSite: true,
        },

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
};

module.exports = appSetup;
