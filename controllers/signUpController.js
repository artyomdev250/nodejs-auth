const userSchema = require('../mongodb/schemas/userSchema');

// Create a new user
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Password must be at least 5 characters
        if (password.length < 5) {
            return res.status(400).json({
                message: "Password must be at least 5 characters long!"
            });
        }

        // Allowed special characters
        const specialCharacterRegex = /[!@#$%^&*()_\+\-=\{\}\[\]:;"'<>,\.?\/\\]/;

        if (!specialCharacterRegex.test(password)) {
            return res.status(400).json({
                message:
                    "Password must contain at least one special character!"
            });
        }

        // Check if email already exists
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use!" });
        }

        // Create user
        const user = await userSchema.create({
            name,
            email,
            password
        });

        res.status(201).json({
            message: "User created successfully!",
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error!" });
    }
};

module.exports = { createUser };
