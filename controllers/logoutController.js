const jwt = require("jsonwebtoken");
const userSchema = require('../mongodb/schemas/userSchema');
const BlacklistedToken = require('../mongodb/schemas/tokenBlacklist');

const logoutUser = async (req, res) => {
    try {
        // 1. Get access token from Authorization header
        const authHeader = req.headers.authorization;
        const accessToken = authHeader && authHeader.split(" ")[1];
        const { refreshToken } = req.body; // or from cookie later

        if (!accessToken || !refreshToken) {
            return res
                .status(400)
                .json({ message: "Access and refresh tokens required!" });
        }

        // 2. Verify refresh token owner
        const user = await userSchema.findOne({ refreshToken });
        if (!user) {
            return res.status(400).json({ message: "Invalid refresh token!" });
        }

        // 3. Verify access token (this enforces expiry)
        let decoded;
        try {
            decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Access token expired!" });
            }
            return res.status(401).json({ message: "Invalid access token!" });
        }

        // 4. Clear refresh token from user (kill long-lived session)
        user.refreshToken = null;
        await user.save();

        // 5. Blacklist this access token until its exp
        await BlacklistedToken.create({
            token: accessToken,
            expiresAt: new Date(decoded.exp * 1000),
        });

        return res.json({ message: "Logged out successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error!" });
    }
};

module.exports = { logoutUser };
