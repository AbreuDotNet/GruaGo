const express = require('express');
const TenantController = require('../controllers/tenantController');

const router = express.Router();

// Get all tenants
router.get('/', TenantController.getAllTenants);

// Get single tenant
router.get('/:id', TenantController.getTenantById);

// Create new tenant
router.post('/', TenantController.createTenant);

// Update tenant
router.put('/:id', TenantController.updateTenant);

// Delete tenant
router.delete('/:id', TenantController.deleteTenant);

module.exports = router;