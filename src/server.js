const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const driverRoutes = require('./routes/driverRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const towRequestRoutes = require('./routes/towRequestRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/tow-requests', towRequestRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GruaGo API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing purposes