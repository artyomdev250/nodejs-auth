const jwt = require('jsonwebtoken');
const userSchema = require('../mongodb/schemas/userSchema');

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken)
            return res.status(400).json({ message: "Refresh token is required!" });

        const user = await userSchema.findOne({ refreshToken });

        if (!user)
            return res.status(403).json({ message: "Invalid refresh token!" });

        // Verify token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token!" });

            const accessToken = jwt.sign(
                { id: decoded.id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
            );

            return res.json({
                accessToken,
                message: "New access token issued!"
            });
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error!" });
    }
};

module.exports = { refreshToken };
