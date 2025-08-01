const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Rutas públicas (no requieren autenticación)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas (requieren autenticación)
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/change-password', authenticateToken, authController.changePassword);
router.post('/logout', authenticateToken, authController.logout);

// Ruta para verificar si el token es válido
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token válido',
    user: {
      id: req.user.id,
      tenantId: req.user.tenantId,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
