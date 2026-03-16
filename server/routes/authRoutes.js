const express = require('express');

const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/signup', asyncHandler(authController.signup));
router.post('/login', asyncHandler(authController.login));
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

module.exports = router;

