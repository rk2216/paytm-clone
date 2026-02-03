const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

export const authMiddleware = (req, res, next) => {
    const headers = req.headers;
    const authorization = headers.authorization;

    if(!authorization || !authorization.startsWith('Bearer ')) {
        res.status(403).json({message: 'Missig access token'});
        return;
    }
    const token = (authorization.split(" "))[1];
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.userId = data.userId;
        next();
        return;
    } catch (err) {
        console.error("Error occurred while verify jwt: ", err);
        res.status(403).json({message: 'Invalid access token'});
    }
}