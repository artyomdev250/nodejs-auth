const express = require('express');
const router = express.Router();

const { createUser } = require('../controllers/signUpController');
const { loginUser } = require('../controllers/signInController');
const { refreshToken } = require('../controllers/refreshTokenController');

router.post('/signup', createUser);
router.post('/signin', loginUser);
router.post('/refresh', refreshToken);

module.exports = router;
