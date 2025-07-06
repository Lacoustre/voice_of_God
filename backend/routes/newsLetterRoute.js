const express = require('express');
const router = express.Router();
const { handleNewsletter } = require('../controller/newsLetterController');

router.post('/', handleNewsletter);

module.exports = router;
