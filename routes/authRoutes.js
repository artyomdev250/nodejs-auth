const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/signUpController');
const { loginUser } = require('../controllers/signInController');

router.post('/signup', createUser);
router.post('/signin', loginUser);

module.exports = router;
