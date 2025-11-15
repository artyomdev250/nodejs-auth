const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

router.get('/home', protect, (req, res) => {
    res.json({
        nickname: req.user.name
    });
});

module.exports = router;
