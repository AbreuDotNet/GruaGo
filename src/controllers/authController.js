const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config({ path: '../.env' });

// Registro de nuevo usuario
const register = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    const { tenantId, fullName, email, phone, password } = req.body;

    // Validar campos requeridos
    if (!tenantId || !fullName || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Todos los campos son requeridos: tenantId, fullName, email, password'
      });
    }

    // Verificar si el email ya existe
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: 'Email already exists',
        message: 'Ya existe un usuario con este email'
      });
    }

    // Verificar que el tenant existe
    const tenantExists = await client.query(
      'SELECT id FROM tenants WHERE id = $1 AND is_active = true',
      [tenantId]
    );

    if (tenantExists.rows.length === 0) {
      return res.status(400).json({
        error: 'Invalid tenant',
        message: 'La empresa especificada no existe o está inactiva'
      });
    }

    // Hashear la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario
    const result = await client.query(
      `INSERT INTO users (tenant_id, full_name, email, phone, password_hash, is_active) 
       VALUES ($1, $2, $3, $4, $5, true) 
       RETURNING id, tenant_id, full_name, email, phone, is_active, created_at`,
      [tenantId, fullName, email, phone, hashedPassword]
    );

    const newUser = result.rows[0];

    // Generar JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        tenantId: newUser.tenant_id,
        email: newUser.email,
        role: 'user'
      },
      process.env.JWT_SECRET || 'gruago_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id,
        tenantId: newUser.tenant_id,
        fullName: newUser.full_name,
        email: newUser.email,
        phone: newUser.phone,
        isActive: newUser.is_active,
        createdAt: newUser.created_at
      },
      token
    });

  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Error interno del servidor durante registro'
    });
  } finally {
    client.release();
  }
};

// Login de usuario
const login = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    console.log('Login attempt:', { email: req.body.email, passwordProvided: !!req.body.password });
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario por email
    console.log('Searching for user with email:', email);
    const result = await client.query(
      `SELECT u.id, u.tenant_id, u.full_name, u.email, u.phone, u.password_hash, u.is_active,
              t.name as tenant_name, t.is_active as tenant_active
       FROM users u 
       JOIN tenants t ON u.tenant_id = t.id 
       WHERE u.email = $1`,
      [email]
    );

    console.log('User query result:', result.rows.length);
    if (result.rows.length === 0) {
      console.log('User not found');
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email o contraseña incorrectos'
      });
    }

    const user = result.rows[0];
    console.log('User found:', { id: user.id, email: user.email, active: user.is_active, tenant_active: user.tenant_active });

    // Verificar que el usuario y su tenant estén activos
    if (!user.is_active) {
      return res.status(401).json({
        error: 'Account inactive',
        message: 'La cuenta de usuario está inactiva'
      });
    }

    if (!user.tenant_active) {
      return res.status(401).json({
        error: 'Company inactive',
        message: 'La empresa asociada está inactiva'
      });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Determinar rol del usuario (por ahora todos son 'user', más adelante se puede expandir)
    let role = 'user';
    
    // Verificar si es admin (puedes agregar lógica para determinar roles)
    const adminCheck = await client.query(
      'SELECT role FROM admin_users WHERE email = $1',
      [email]
    );
    
    if (adminCheck.rows.length > 0) {
      role = adminCheck.rows[0].role;
    }

    // Generar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        tenantId: user.tenant_id,
        email: user.email,
        role: role
      },
      process.env.JWT_SECRET || 'gruago_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        tenant_id: user.tenant_id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        tenant_name: user.tenant_name,
        role: role
      },
      token
    });

  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  } finally {
    client.release();
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    const userId = req.user.id;

    const result = await client.query(
      `SELECT u.id, u.tenant_id, u.full_name, u.email, u.phone, u.is_active, u.created_at,
              t.name as tenant_name
       FROM users u 
       JOIN tenants t ON u.tenant_id = t.id 
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Usuario no encontrado'
      });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        tenantId: user.tenant_id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        tenantName: user.tenant_name,
        role: req.user.role,
        isActive: user.is_active,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      error: 'Profile fetch failed',
      message: 'Error obteniendo perfil de usuario'
    });
  } finally {
    client.release();
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Missing passwords',
        message: 'Contraseña actual y nueva son requeridas'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Obtener contraseña actual
    const result = await client.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const passwordMatch = await bcrypt.compare(currentPassword, result.rows[0].password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Invalid current password',
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Hashear nueva contraseña
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await client.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedNewPassword, userId]
    );

    res.json({
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      error: 'Password change failed',
      message: 'Error cambiando contraseña'
    });
  } finally {
    client.release();
  }
};

// Logout (invalidar token - en una implementación real usarías una blacklist de tokens)
const logout = async (req, res) => {
  // En una implementación más avanzada, aquí agregarías el token a una blacklist
  // Por ahora, simplemente respondemos que el logout fue exitoso
  // El cliente debería eliminar el token del localStorage/sessionStorage
  
  res.json({
    message: 'Logout exitoso'
  });
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
  logout
};
