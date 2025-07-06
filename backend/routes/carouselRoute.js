const express = require('express');
const router = express.Router();
const carouselController = require('../controller/carouselController');

router.get('/top', carouselController.getTopCarousel);
router.get('/donation', carouselController.getDonationCarousel);
router.post('/top', carouselController.createTopCarouselItem);
router.post('/donation', carouselController.createDonationCarouselItem);

module.exports = router;