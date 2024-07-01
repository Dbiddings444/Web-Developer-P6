const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Auth token is missing!' });
        }
        const decodedToken = jwt.verify(token, 'YOUR_SECRET_KEY');
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Auth failed!' });
    }
};
