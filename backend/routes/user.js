const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const rateLimitLogin = require('../middleware/rate-limit-login-config');

router.post('/signup', userCtrl.signup);
router.post('/login', rateLimitLogin, userCtrl.login);

module.exports = router;