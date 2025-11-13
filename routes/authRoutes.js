const express = require('express');
const router = express.Router();

router.get('/signin', (req, res) => {
    res.send('Sign in');
});

router.get('/signup', (req, res) => {
    res.send('Sign up');
});

router.get('/signout', (req, res) => {
    res.send('Sign out');
});

router.get('/refresh', (req, res) => {
    res.send('Refresh token');
});

module.exports = router;
