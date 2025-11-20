const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./mongodb/connect');

dotenv.config();

const app = express();

// CORS CONFIG
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173/",
    credentials: true,
}));

app.use(express.json());

// Connect database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
