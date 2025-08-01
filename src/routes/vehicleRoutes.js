const express = require('express');
const VehicleController = require('../controllers/vehicleController');

const router = express.Router();

// Get all vehicles
router.get('/', VehicleController.getAllVehicles);

// Get vehicles by driver
router.get('/driver/:driverId', VehicleController.getVehiclesByDriver);

// Get single vehicle
router.get('/:id', VehicleController.getVehicleById);

// Create new vehicle
router.post('/', VehicleController.createVehicle);

// Update vehicle
router.put('/:id', VehicleController.updateVehicle);

// Delete vehicle
router.delete('/:id', VehicleController.deleteVehicle);

module.exports = router;