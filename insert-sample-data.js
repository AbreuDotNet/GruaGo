const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

async function insertSampleData() {
  const client = await pool.connect();
  console.log('🌱 Insertando datos de prueba...');

  try {
    // Limpiar datos existentes (en orden inverso por las dependencias)
    console.log('🧹 Limpiando datos anteriores...');
    await client.query('TRUNCATE TABLE tow_requests, services, vehicles, drivers, users, tenants RESTART IDENTITY CASCADE');
    console.log('✅ Datos anteriores eliminados');

    // 1. Crear tenants (empresas)
    console.log('📋 Creando empresas...');
    const tenantResult = await client.query(`
      INSERT INTO tenants (name, contact_email, is_active) VALUES 
      ('GruaGo Central', 'admin@gruago.com', true),
      ('Grúas del Norte', 'norte@gruasdelno.com', true),
      ('Servicio Express', 'info@servicioexpress.com', true)
      RETURNING id, name
    `);
    console.log(`✅ ${tenantResult.rows.length} empresas creadas`);

    // 2. Crear usuarios
    console.log('👥 Creando usuarios...');
    const userResult = await client.query(`
      INSERT INTO users (tenant_id, full_name, email, phone, password_hash, is_active) VALUES 
      (1, 'Juan Pérez', 'juan.perez@email.com', '+52-555-1234', '$2b$10$hash1', true),
      (1, 'María García', 'maria.garcia@email.com', '+52-555-5678', '$2b$10$hash2', true),
      (2, 'Carlos López', 'carlos.lopez@email.com', '+52-555-9012', '$2b$10$hash3', true),
      (2, 'Ana Martínez', 'ana.martinez@email.com', '+52-555-3456', '$2b$10$hash4', true),
      (3, 'Luis Rodriguez', 'luis.rodriguez@email.com', '+52-555-7890', '$2b$10$hash5', true)
      RETURNING id, full_name, email
    `);
    console.log(`✅ ${userResult.rows.length} usuarios creados`);
    userResult.rows.forEach(user => console.log(`  - ${user.full_name} (${user.email})`));

    // 3. Crear conductores
    console.log('🚗 Creando conductores...');
    const driverResult = await client.query(`
      INSERT INTO drivers (tenant_id, full_name, phone, license_number, is_active) VALUES 
      (1, 'Roberto Sánchez', '+52-555-2468', 'LIC001', true),
      (1, 'Miguel Torres', '+52-555-1357', 'LIC002', true),
      (2, 'Fernando Díaz', '+52-555-9753', 'LIC003', true),
      (2, 'Alejandro Ruiz', '+52-555-8642', 'LIC004', true),
      (3, 'Daniel Morales', '+52-555-7531', 'LIC005', true)
      RETURNING id, full_name, license_number
    `);
    console.log(`✅ ${driverResult.rows.length} conductores creados`);
    driverResult.rows.forEach(driver => console.log(`  - ${driver.full_name} (${driver.license_number})`));

    // 4. Crear vehículos
    console.log('🚛 Creando vehículos...');
    const vehicleResult = await client.query(`
      INSERT INTO vehicles (driver_id, plate_number, vehicle_type, brand, model, year, is_active) VALUES 
      (1, 'ABC-123', 'Grúa Ligera', 'Ford', 'F-350', 2022, true),
      (2, 'DEF-456', 'Grúa Pesada', 'Kenworth', 'T800', 2021, true),
      (3, 'GHI-789', 'Grúa Mediana', 'Chevrolet', 'Silverado', 2023, true),
      (4, 'JKL-012', 'Grúa Ligera', 'Ram', '3500', 2022, true),
      (5, 'MNO-345', 'Grúa Pesada', 'Peterbilt', '389', 2020, true)
      RETURNING id, plate_number, brand, model
    `);
    console.log(`✅ ${vehicleResult.rows.length} vehículos creados`);
    vehicleResult.rows.forEach(vehicle => console.log(`  - ${vehicle.brand} ${vehicle.model} (${vehicle.plate_number})`));

    // 5. Crear servicios
    console.log('⚙️ Creando servicios...');
    const serviceResult = await client.query(`
      INSERT INTO services (tenant_id, name, description, base_price, is_active) VALUES 
      (1, 'Remolque Básico', 'Servicio de remolque estándar', 800.00, true),
      (1, 'Remolque Premium', 'Servicio de remolque con cuidado especial', 1200.00, true),
      (2, 'Rescate de Emergencia', 'Servicio 24/7 de emergencia', 1500.00, true),
      (3, 'Traslado Express', 'Servicio rápido de traslado', 1000.00, true)
      RETURNING id, name, base_price
    `);
    console.log(`✅ ${serviceResult.rows.length} servicios creados`);
    serviceResult.rows.forEach(service => console.log(`  - ${service.name} ($${service.base_price})`));

    // 6. Crear solicitudes de grúa
    console.log('🚨 Creando solicitudes de grúa...');
    const towRequestResult = await client.query(`
      INSERT INTO tow_requests (tenant_id, user_id, service_id, origin_address, destination_address, distance_km, total_price, status, requested_at) VALUES 
      (1, 1, 1, 'Av. Insurgentes 123, CDMX', 'Taller Mecánico Central', 12.5, 950.00, 'pending', NOW() - INTERVAL '2 days'),
      (1, 2, 2, 'Periferico Norte Km 15', 'Concesionario Ford', 18.0, 1400.00, 'pending', NOW() - INTERVAL '1 day'),
      (2, 3, 3, 'Carretera México-Puebla Km 45', 'Taller Express', 25.0, 1800.00, 'pending', NOW() - INTERVAL '3 hours'),
      (2, 4, 1, 'Zona Rosa, CDMX', 'Domicilio Particular', 8.5, 850.00, 'pending', NOW() - INTERVAL '30 minutes'),
      (3, 5, 4, 'Aeropuerto CDMX', 'Hotel Marriott', 15.0, 1100.00, 'pending', NOW() - INTERVAL '1 hour')
      RETURNING id, origin_address, status, total_price
    `);
    console.log(`✅ ${towRequestResult.rows.length} solicitudes creadas`);
    towRequestResult.rows.forEach(request => console.log(`  - #${request.id}: ${request.origin_address} (${request.status}) - $${request.total_price}`));

    console.log('\n🎉 ¡Datos de prueba insertados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`  🏢 ${tenantResult.rows.length} Empresas`);
    console.log(`  👥 ${userResult.rows.length} Usuarios`);
    console.log(`  🚗 ${driverResult.rows.length} Conductores`);
    console.log(`  🚛 ${vehicleResult.rows.length} Vehículos`);
    console.log(`  ⚙️ ${serviceResult.rows.length} Servicios`);
    console.log(`  🚨 ${towRequestResult.rows.length} Solicitudes`);

  } catch (error) {
    console.error('❌ Error insertando datos:', error.message);
    if (error.code === '23505') {
      console.log('⚠️  Algunos datos ya existen (duplicados)');
    }
  } finally {
    client.release();
    await pool.end();
  }
}

insertSampleData();
