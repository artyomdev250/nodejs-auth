const userSchema = require('../mongodb/schemas/userSchema');
const BlacklistedToken = require('../mongodb/schemas/tokenBlacklist');

const logoutUser = async (req, res) => {
    try {
        const { accessToken, refreshToken } = req.body;

        if (!refreshToken || !accessToken) {
            return res.status(400).json({ message: "Access and refresh tokens required!" });
        }

        // Find user
        const user = await userSchema.findOne({ refreshToken });

        if (!user) {
            return res.status(400).json({ message: "Invalid refresh token!" });
        }

        // DELETE refresh token (session end)
        user.refreshToken = null;
        await user.save();

        // BLACKLIST the access token
        const decoded = require("jsonwebtoken").decode(accessToken);

        await BlacklistedToken.create({
            token: accessToken,
            expiresAt: new Date(decoded.exp * 1000) // expires same time as JWT
        });

        return res.json({ message: "Logged out successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error!" });
    }
};

module.exports = { logoutUser };
