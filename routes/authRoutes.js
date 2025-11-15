const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/signUpController');
const { loginUser } = require('../controllers/signInController');
const { refreshToken } = require('../controllers/refreshTokenController');
const { logoutUser } = require('../controllers/logoutController');

router.post('/signup', createUser);
router.post('/signin', loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

module.exports = router;
