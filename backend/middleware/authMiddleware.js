module.exports = function authMiddleWare(req, res, next) {
    if (req.session && req.session.user_id) {
        return next();
    }
    return res.status(401).json({ message: 'You must be logged in to join a room'});
};
