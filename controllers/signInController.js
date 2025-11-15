const userSchema = require('../mongodb/schemas/userSchema');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!" });
        }

        // Find user
        const user = await userSchema.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password!" });

        // Compare passwords (no hashing yet)
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid email or password!" });
        }

        // Create tokens
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
        );

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        return res.json({
            message: "Login successful!",
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error!" });
    }
};

module.exports = { loginUser };
