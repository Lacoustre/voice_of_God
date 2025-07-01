const express = require('express');
const router = express.Router();
const serviceController = require('../controller/serviceController');

router.post('/', serviceController.createService);
router.get('/', serviceController.getServices);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);
router.post('/upload-image', serviceController.uploadServiceImage);

module.exports = router;