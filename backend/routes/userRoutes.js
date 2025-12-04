const express = require('express');
const {profile} = require('../controller/userController');
const {authMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, profile);

module.exports = router;