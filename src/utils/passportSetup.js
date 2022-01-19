const GoogleStrategy = require('passport-google-oauth20').Strategy;

const passportConfigure = (passport) => {
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
            state: true,
        },
        function (accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        }
    ));

    passport.serializeUser(function (user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
    });
};

module.exports = passportConfigure;
