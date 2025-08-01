const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

async function testConnection() {
  console.log('🔗 Probando conexión a PostgreSQL...');
  console.log(`📍 Host: ${process.env.PG_HOST}`);
  console.log(`🔌 Puerto: ${process.env.PG_PORT}`);
  console.log(`🗄️  Base de datos: ${process.env.PG_DATABASE}`);
  console.log(`👤 Usuario: ${process.env.PG_USER}`);
  console.log('');

  try {
    // Intentar conectar a PostgreSQL
    const client = await pool.connect();
    console.log('✅ Conexión exitosa a PostgreSQL!');
    
    // Probar una consulta simple
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    console.log('⏰ Hora del servidor:', result.rows[0].current_time);
    console.log('📋 Versión PostgreSQL:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);
    
    // Verificar si la base de datos existe
    const dbCheck = await client.query(`
      SELECT datname FROM pg_database WHERE datname = $1
    `, [process.env.PG_DATABASE]);
    
    if (dbCheck.rows.length > 0) {
      console.log('✅ Base de datos existe:', process.env.PG_DATABASE);
    } else {
      console.log('❌ Base de datos NO existe:', process.env.PG_DATABASE);
    }
    
    // Verificar tablas existentes
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📊 Tablas en la base de datos:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
      
      // Si hay tablas, mostrar algunos datos de ejemplo
      console.log('\n📋 Datos de ejemplo:');
      try {
        const usersCount = await client.query('SELECT COUNT(*) as count FROM users');
        console.log(`  👥 Usuarios: ${usersCount.rows[0].count}`);
      } catch (e) {
        console.log('  👥 Usuarios: tabla no accesible');
      }
      
      try {
        const driversCount = await client.query('SELECT COUNT(*) as count FROM drivers');
        console.log(`  🚗 Conductores: ${driversCount.rows[0].count}`);
      } catch (e) {
        console.log('  🚗 Conductores: tabla no accesible');
      }
      
    } else {
      console.log('  ⚠️  No hay tablas creadas aún');
      console.log('\n💡 Para crear las tablas, ejecuta el script:');
      console.log('   src/config/init.sql');
    }
    
    client.release();
    console.log('\n🎉 ¡Prueba de conexión exitosa!');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('📋 Código de error:', error.code);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Posibles soluciones:');
      console.log('   1. Verificar que PostgreSQL esté ejecutándose en puerto 5433');
      console.log('   2. Comprobar: Get-Service postgresql*');
    } else if (error.code === '3D000') {
      console.log('\n💡 La base de datos no existe. Crear con:');
      console.log(`   createdb -p 5433 -U postgres ${process.env.PG_DATABASE}`);
    } else if (error.code === '28P01') {
      console.log('\n💡 Error de autenticación. Verificar:');
      console.log('   1. Usuario y contraseña en .env');
      console.log('   2. Configuración de pg_hba.conf');
    }
  }
  
  await pool.end();
}

testConnection();
