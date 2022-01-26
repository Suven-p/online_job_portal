import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { NewUserInput } from '@typings/User';
import { createNewUser, getFederatedCredentials, getUserByEmail, getUserByUid } from '../models/User';
import { verifyPassword } from './password';

import connection from '@utils/dbSetup';

const passportConfigure = (passport) => {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
            state: true,
        },
        async (accessToken, refreshToken, profile, cb) => {
            try {
                const providerData = await getFederatedCredentials("google", profile.id);
                let user: User;
                if (providerData.length === 0) {
                    const userData = await getUserByEmail(profile.emails[0].value);
                    if (userData.length === 0) {
                        const newUser: NewUserInput = {
                            email: profile.emails[0].value,
                            firstName: profile.name.givenName,
                            middleName: profile.name.middleName,
                            lastName: profile.name.familyName,
                            picture: profile.photos[0].value,
                        };
                        user = await createNewUser(newUser);
                    } else {
                        user = userData[0];
                    }
                    await connection.execute(
                        'INSERT INTO federated_credentials ' +
                        '(uid, provider, identifier) ' +
                        'VALUES (?, ?, ?)',
                        [
                            user.uid,
                            'google',
                            profile.id,
                        ]
                    );
                } else {
                    const [userData] = await getUserByUid(providerData[0].uid);
                    user = userData[0];
                }
                return cb(null, user);
            } catch (err) {
                console.error('Error in quering database', err);
                return cb(err, null);
            }
        }
    ));

    passport.use(new LocalStrategy(async (email, password, cb) => {
        try {
            const invalidDataPrompt = 'Incorrect username or password';
            const userData = await getUserByEmail(email);
            if (userData.length === 0) {
                return cb(null, false, { message: invalidDataPrompt });
            }
            const user: User = userData[0];
            const passwordMatches = verifyPassword(password, user.password);
            if (!passwordMatches) {
                return cb(null, false, { message: invalidDataPrompt });
            }
            return cb(null, user);
        } catch (err) {
            console.error('Error in local login: ', err);
            return cb(err, null);
        }
    }));

    passport.serializeUser((user, cb) => {
        cb(null, user.uid);
    });

    passport.deserializeUser(async (obj, cb) => {
        try {
            if (!obj) return cb(null, null);
            const userData = await getUserByUid(obj);
            if (userData.length === 0) return cb(null, null);
            cb(null, userData[0]);
        } catch (err) {
            console.error('Error in quering database: deserializeUser', err);
            return cb(err, null);
        }
    });
};

export default passportConfigure;