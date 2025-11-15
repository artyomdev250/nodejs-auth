const jwt = require('jsonwebtoken');
const userSchema = require('../mongodb/schemas/userSchema');

const protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token!" });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await userSchema.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found!" });
        }

        req.user = user; // attach user to request
        next();

    } catch (error) {
        console.error("Middleware error:", error.message);
        return res.status(401).json({ message: "Not authorized, invalid token!" });
    }
};

module.exports = { protect };
