const axios = require('axios').default;

const BASE_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Probando endpoints de la API GruaGo...\n');

  try {
    // Test 1: Get all users
    console.log('1️⃣ Probando GET /api/users');
    const usersResponse = await axios.get(`${BASE_URL}/users`);
    console.log(`✅ Usuarios obtenidos: ${usersResponse.data.count}`);
    
    // Test 2: Get all drivers
    console.log('\n2️⃣ Probando GET /api/drivers');
    const driversResponse = await axios.get(`${BASE_URL}/drivers`);
    console.log(`✅ Conductores obtenidos: ${driversResponse.data.count}`);
    
    // Test 3: Get all tow requests
    console.log('\n3️⃣ Probando GET /api/tow-requests');
    const towRequestsResponse = await axios.get(`${BASE_URL}/tow-requests`);
    console.log(`✅ Solicitudes obtenidas: ${towRequestsResponse.data.count}`);
    towRequestsResponse.data.data.slice(0, 3).forEach(request => {
      console.log(`  - #${request.id}: ${request.pickup_location} (${request.status})`);
    });
    
    // Test 4: Get all tenants
    console.log('\n4️⃣ Probando GET /api/tenants');
    const tenantsResponse = await axios.get(`${BASE_URL}/tenants`);
    console.log(`✅ Empresas obtenidas: ${tenantsResponse.data.count}`);
    
    // Test 5: Get all vehicles
    console.log('\n5️⃣ Probando GET /api/vehicles');
    const vehiclesResponse = await axios.get(`${BASE_URL}/vehicles`);
    console.log(`✅ Vehículos obtenidos: ${vehiclesResponse.data.count}`);
    
    // Test 6: Get all services
    console.log('\n6️⃣ Probando GET /api/services');
    const servicesResponse = await axios.get(`${BASE_URL}/services`);
    console.log(`✅ Servicios obtenidos: ${servicesResponse.data.count}`);
    
    // Test 7: Create new user
    console.log('\n7️⃣ Probando POST /api/users (crear usuario)');
    const newUser = {
      tenant_id: 1,
      full_name: 'Usuario de Prueba API',
      email: `test${Date.now()}@email.com`,
      phone: '+52-555-TEST',
      password_hash: '$2b$10$testhash',
      is_active: true
    };
    const createUserResponse = await axios.post(`${BASE_URL}/users`, newUser);
    console.log(`✅ Usuario creado: ${createUserResponse.data.data.full_name} (ID: ${createUserResponse.data.data.id})`);
    
    console.log('\n🎉 ¡Todos los endpoints funcionan correctamente!');
    console.log('\n📊 Resumen de la API:');
    console.log(`  👥 ${usersResponse.data.count} Usuarios`);
    console.log(`  🚗 ${driversResponse.data.count} Conductores`);
    console.log(`  🚨 ${towRequestsResponse.data.count} Solicitudes`);
    console.log(`  🏢 ${tenantsResponse.data.count} Empresas`);
    console.log(`  🚛 ${vehiclesResponse.data.count} Vehículos`);
    console.log(`  ⚙️ ${servicesResponse.data.count} Servicios`);
    
  } catch (error) {
    console.error('❌ Error probando API:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Asegúrate de que el servidor esté ejecutándose en puerto 3000');
    }
  }
}

testAPI();
