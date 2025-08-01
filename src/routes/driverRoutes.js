const express = require('express');
const DriverController = require('../controllers/driverController');

const router = express.Router();

// Get all drivers
router.get('/', DriverController.getAllDrivers);

// Get drivers by tenant
router.get('/tenant/:tenantId', DriverController.getDriversByTenant);

// Get single driver
router.get('/:id', DriverController.getDriverById);

// Create new driver
router.post('/', DriverController.createDriver);

// Update driver
router.put('/:id', DriverController.updateDriver);

// Delete driver
router.delete('/:id', DriverController.deleteDriver);

module.exports = router;