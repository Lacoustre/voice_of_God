const express = require('express');
const router = express.Router();
const { testEmailService } = require('../controller/emailTestController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected route - only authenticated users can test email service
router.post('/test', authMiddleware, testEmailService);

module.exports = router;