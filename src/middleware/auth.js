const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

// Middleware para verificar JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'No se proporcionó token de autenticación' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gruago_secret_key');
    
    // Verificar si el usuario existe y está activo
    const client = await pool.connect();
    const result = await client.query(
      'SELECT id, tenant_id, full_name, email, is_active FROM users WHERE id = $1 AND is_active = true',
      [decoded.userId]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Usuario no encontrado o inactivo' 
      });
    }

    // Agregar información del usuario al request
    req.user = {
      id: decoded.userId,
      tenantId: result.rows[0].tenant_id,
      fullName: result.rows[0].full_name,
      email: result.rows[0].email,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'Token de autenticación inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        error: 'Token expired',
        message: 'Token de autenticación expirado' 
      });
    }

    return res.status(500).json({ 
      error: 'Authentication error',
      message: 'Error interno de autenticación' 
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Se requiere autenticación' 
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: 'Permisos insuficientes para acceder a este recurso' 
      });
    }

    next();
  };
};

// Middleware para verificar que el usuario pertenece al tenant correcto
const requireTenant = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Se requiere autenticación' 
    });
  }

  // Si se especifica tenantId en los parámetros, verificar que coincida
  if (req.params.tenantId && parseInt(req.params.tenantId) !== req.user.tenantId) {
    return res.status(403).json({ 
      error: 'Access denied',
      message: 'No tiene permisos para acceder a los datos de esta empresa' 
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireTenant
};
