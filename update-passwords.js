const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

async function updatePasswords() {
  const client = await pool.connect();
  console.log('🔐 Actualizando contraseñas de usuarios...');

  try {
    // Crear hashes reales para todos los usuarios
    const password = 'password123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(`📝 Hash generado: ${hashedPassword}`);

    // Actualizar todos los usuarios con la misma contraseña para pruebas
    const result = await client.query(`
      UPDATE users 
      SET password_hash = $1 
      WHERE password_hash LIKE '$2b$10$hash%'
      RETURNING id, full_name, email
    `, [hashedPassword]);

    console.log(`✅ ${result.rows.length} usuarios actualizados con contraseña real`);
    
    result.rows.forEach(user => {
      console.log(`  - ${user.full_name} (${user.email})`);
    });

    console.log('\n🎯 Credenciales de prueba:');
    console.log('  Email: juan.perez@email.com');
    console.log('  Password: password123');
    console.log('\n📋 Todos los usuarios ahora tienen la misma contraseña para pruebas: password123');

  } catch (error) {
    console.error('❌ Error actualizando contraseñas:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

updatePasswords();
