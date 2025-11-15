const jwt = require('jsonwebtoken');
const userSchema = require('../mongodb/schemas/userSchema');
const BlacklistedToken = require('../mongodb/schemas/tokenBlacklist');

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token!" });
        }

        // Check if token is blacklisted
        const blacklisted = await BlacklistedToken.findOne({ token });
        if (blacklisted) {
            return res.status(401).json({ message: "Token is invalid (logged out)!" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = await userSchema.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, invalid token!" });
    }
};

module.exports = { protect };
