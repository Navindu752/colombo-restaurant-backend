const jwt = require('jsonwebtoken');
const { JWT_EXPIRED, YOU_ARE_NOT_AUTHORIZED } = require('../constants');
const User = require('../../models/userModel');
require('dotenv').config(); // to load .env file content

const verifyToken = async (req, res, next) => {
    try {
        // Get auth header value
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array
            const bearerToken = bearer[1];
            // Set the token
            req.accessToken = bearerToken;
            // decode jwt
            const decoded = jwt.verify(bearerToken, process.env.JWT_KEY);
            req.user = decoded
            const { id } = req.user;
            // check if user exist
            const checkUserExist = await User.findOne({ _id: id });
            // check if token has expired
            if (!checkUserExist || new Date().getTime() >= decoded?.exp * 1000) {
                return res.status(401).json(JWT_EXPIRED);
            }
            req.user = { ...checkUserExist }

            // Next middleware
            next();
        } else {
            // Forbidden
            res.sendStatus(403);
        }
    } catch (error) {
        console.log(error)
        if (error?.name === 'TokenExpiredError') {
            return res.status(401).json(JWT_EXPIRED);
        } else if (error?.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: YOU_ARE_NOT_AUTHORIZED });
        } else {
            return res.status(400).json(error);
        }
    }
}

module.exports = { verifyToken };
