const express = require('express');
const router = express.Router();
const { getDashboardMetrics } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

// Get dashboard metrics
router.get('/metrics', authenticateToken, getDashboardMetrics);

module.exports = router;
