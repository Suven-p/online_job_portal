import express from 'express';
const router = express.Router();
import passport from 'passport';

router.get(
    '/',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
    '/callback',
    (req, res, next) => {
        passport.authenticate('google', (err, user, info) => {
            if (err || !user) {
                console.error(`Error while logging in. Error: ${err} Info: ${info}`);
                req.session.messages = info;
                return res.redirect('/failed');
            }
            req.login(user, (err) => {
                if (err) {
                    console.error('Error while logging in user', err);
                    return next(err);
                }
                return res.redirect('/api/userinfo');
            });
        })(req, res, next);
    }
);

export default router;