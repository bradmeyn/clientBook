export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        req.flash('error', 'Please login');
        return res.redirect('/login');
    }
};
