module.exports = function(req, res, next) {
    if (req.session && req.session.isOwner) {
        next();
    } else {
        // res.status(401).json({ message: 'Unauthorized. Please log in.' });
        res.redirect('/owners/login');
        req.flash('error', 'Please log in to access this page.');
    }
};