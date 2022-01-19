function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(400).json({
        message: 'access denied',
    });
}

module.exports = isLoggedIn;
