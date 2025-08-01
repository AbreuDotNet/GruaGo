const express = require('express');
const ServiceController = require('../controllers/serviceController');

const router = express.Router();

// Get all services
router.get('/', ServiceController.getAllServices);

// Get services by tenant
router.get('/tenant/:tenantId', ServiceController.getServicesByTenant);

// Get single service
router.get('/:id', ServiceController.getServiceById);

// Create new service
router.post('/', ServiceController.createService);

// Update service
router.put('/:id', ServiceController.updateService);

// Delete service
router.delete('/:id', ServiceController.deleteService);

module.exports = router;