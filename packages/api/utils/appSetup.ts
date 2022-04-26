import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import logger from '@utils/logger';
import passportSetup from './passportSetup';
import dbConnection from './dbSetup';
import { getEnv } from '@root/services/Configuration/env';
let session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const appSetup = (app: express.Application) => {
  app.use(express.static('./dist/public'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const sessionStore = new MySQLStore({}, dbConnection, (err: any) => {
    if (err) {
      logger.error(`Error setting up sessionStore: ${err}`);
      throw err;
    } else {
      logger.info('Session store connected!');
    }
  });
  const cookieMaxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
  const sess = {
    name: 'sessionId',
    secret: getEnv('SESSION_SECRET'),
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: cookieMaxAge,
      secure: app.get('env') === 'production',
      httpOnly: true,
      // sameSite: true,
    },
  };
  app.set('trust proxy', 1);

  app.use(session(sess));

  passportSetup(passport);
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(morgan('combined'));
};

export default appSetup;
