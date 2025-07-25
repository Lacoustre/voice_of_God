const express = require('express');
const router = express.Router();
const ministriesController = require('../controller/ministriesController');

// Get all ministries
router.get('/', ministriesController.getMinistries);

// Create a new ministry
router.post('/', ministriesController.createMinistry);

// Update a ministry
router.put('/:id', ministriesController.updateMinistry);

// Delete a ministry
router.delete('/:id', ministriesController.deleteMinistry);

module.exports = router;