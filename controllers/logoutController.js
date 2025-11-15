const userSchema = require('../mongodb/schemas/userSchema');

const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required!" });
        }

        // Find user with this refresh token
        const user = await userSchema.findOne({ refreshToken });

        if (!user) {
            return res.status(400).json({ message: "Invalid refresh token!" });
        }

        // Remove refresh token (logout)
        user.refreshToken = null;
        await user.save();

        return res.json({ message: "Logged out successfully!" });

    } catch (error) {
        console.error("Logout error:", error.message);
        res.status(500).json({ message: "Server error!" });
    }
};

module.exports = { logoutUser };
