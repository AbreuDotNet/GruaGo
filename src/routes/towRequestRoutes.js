const express = require('express');
const TowRequestController = require('../controllers/towRequestController');

const router = express.Router();

// Get all tow requests
router.get('/', TowRequestController.getAllRequests);

// Get tow requests by tenant
router.get('/tenant/:tenantId', TowRequestController.getRequestsByTenant);

// Get tow requests by user
router.get('/user/:userId', TowRequestController.getRequestsByUser);

// Get tow requests by driver
router.get('/driver/:driverId', TowRequestController.getRequestsByDriver);

// Get single tow request
router.get('/:id', TowRequestController.getRequestById);

// Create new tow request
router.post('/', TowRequestController.createRequest);

// Update tow request
router.put('/:id', TowRequestController.updateRequest);

// Update tow request status
router.patch('/:id/status', TowRequestController.updateRequestStatus);

// Delete tow request
router.delete('/:id', TowRequestController.deleteRequest);

module.exports = router;