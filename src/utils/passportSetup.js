const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./dbSetup');

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
                let user = {};
                const [providerData] = await connection.query(
                    'SELECT uid FROM ' +
                    'federated_credentials f INNER JOIN federated_credentials_provider p ON' +
                    'f.provider_id = p.provider_name ' +
                    'WHERE provider_name = "google" AND identifier = ?',
                    [profile.id]
                );
                if (providerData.length === 0) {
                    const [userData] = await connection.query(
                        'SELECT uid FROM emails WHERE email = ?',
                        [profile.emails[0].value]
                    );
                    if (userData.length === 0) {
                        user = {
                            uid: uuidv4(),
                            email: profile.emails[0].value,
                            firstname: profile.name.givenName || null,
                            middlename: profile.name.middleName || null,
                            lastname: profile.name.familyName || null,
                            picture: profile.photos[0].value || null,
                        };
                        await connection.execute(
                            'INSERT INTO users ' +
                            '(uid, email, firstname, middlename, lastname, picture) ' +
                            'VALUES (?, ?, ?, ?, ?, ?)',
                            [...Object.values(user)]
                        );
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
                    const [userData] = await connection.query(
                        'SELECT * FROM users WHERE uid = ?',
                        [providerData[0].uid]
                    );
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
            const [userData] = await connection.query(
                'SELECT * FROM users INNER JOIN email ON email.uid = users.uid WHERE email = ?',
                [email]
            );
            if (userData.length === 0) {
                return cb(null, false, { message: invalidDataPrompt });
            }
            const user = userData[0];
            user.email = email;
            const passwordMatches = await bcrypt.compare(password, user.password);
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
            const [userData] = await connection.query(
                'SELECT * FROM users WHERE uid = ?',
                [obj]
            );
            cb(null, userData[0]);
        } catch (err) {
            console.error('Error in quering database', err);
            return cb(err, null);
        }
    });
};

module.exports = passportConfigure;
