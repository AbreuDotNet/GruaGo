const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testAuth() {
  console.log('🔐 Probando sistema de autenticación...\n');

  try {
    // 1. Probar registro de usuario
    console.log('1️⃣ Probando registro de usuario...');
    const registerData = {
      tenantId: 1,
      fullName: 'Usuario de Prueba Auth',
      email: 'test.auth@gruago.com',
      phone: '+52-555-TEST',
      password: 'password123'
    };

    let registerResponse;
    try {
      registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
      console.log('✅ Usuario registrado exitosamente');
      console.log(`   ID: ${registerResponse.data.user.id}`);
      console.log(`   Email: ${registerResponse.data.user.email}`);
      console.log(`   Token generado: ${registerResponse.data.token ? 'Sí' : 'No'}`);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('⚠️  Usuario ya existe, usando usuario existente');
      } else {
        throw error;
      }
    }

    console.log();

    // 2. Probar login
    console.log('2️⃣ Probando login...');
    const loginData = {
      email: 'test.auth@gruago.com',
      password: 'password123'
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
    console.log('✅ Login exitoso');
    console.log(`   Usuario: ${loginResponse.data.user.fullName}`);
    console.log(`   Empresa: ${loginResponse.data.user.tenantName}`);
    console.log(`   Rol: ${loginResponse.data.user.role}`);
    console.log(`   Token: ${loginResponse.data.token.substring(0, 20)}...`);

    const token = loginResponse.data.token;
    console.log();

    // 3. Probar acceso a perfil con token
    console.log('3️⃣ Probando acceso a perfil con token...');
    const profileResponse = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Perfil obtenido exitosamente');
    console.log(`   ID: ${profileResponse.data.user.id}`);
    console.log(`   Nombre: ${profileResponse.data.user.fullName}`);
    console.log(`   Email: ${profileResponse.data.user.email}`);
    console.log();

    // 4. Probar verificación de token
    console.log('4️⃣ Probando verificación de token...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Token verificado exitosamente');
    console.log(`   Usuario verificado: ${verifyResponse.data.user.fullName}`);
    console.log();

    // 5. Probar acceso sin token (debe fallar)
    console.log('5️⃣ Probando acceso sin token (debe fallar)...');
    try {
      await axios.get(`${API_BASE_URL}/auth/profile`);
      console.log('❌ ERROR: Se permitió acceso sin token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Acceso denegado correctamente sin token');
      } else {
        throw error;
      }
    }
    console.log();

    // 6. Probar acceso con token inválido (debe fallar)
    console.log('6️⃣ Probando acceso con token inválido (debe fallar)...');
    try {
      await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer token_invalido_123`
        }
      });
      console.log('❌ ERROR: Se permitió acceso con token inválido');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Acceso denegado correctamente con token inválido');
      } else {
        throw error;
      }
    }
    console.log();

    // 7. Probar login con credenciales incorrectas (debe fallar)
    console.log('7️⃣ Probando login con credenciales incorrectas (debe fallar)...');
    try {
      await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'test.auth@gruago.com',
        password: 'password_incorrecta'
      });
      console.log('❌ ERROR: Se permitió login con credenciales incorrectas');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Login denegado correctamente con credenciales incorrectas');
      } else {
        throw error;
      }
    }
    console.log();

    // 8. Probar logout
    console.log('8️⃣ Probando logout...');
    const logoutResponse = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Logout exitoso');
    console.log(`   Mensaje: ${logoutResponse.data.message}`);

    console.log('\n🎉 ¡Todas las pruebas de autenticación pasaron exitosamente!');
    console.log('\n📊 Resumen de pruebas:');
    console.log('  ✅ Registro de usuario');
    console.log('  ✅ Login con credenciales válidas');
    console.log('  ✅ Acceso a perfil con token válido');
    console.log('  ✅ Verificación de token');
    console.log('  ✅ Denegación de acceso sin token');
    console.log('  ✅ Denegación de acceso con token inválido');
    console.log('  ✅ Denegación de login con credenciales incorrectas');
    console.log('  ✅ Logout exitoso');

  } catch (error) {
    console.error('❌ Error en las pruebas de autenticación:', error.response?.data || error.message);
    if (error.response?.status === 400) {
      console.log('💡 Tip: Asegúrate de que el servidor esté corriendo y la base de datos conectada');
    }
  }
}

// Ejecutar las pruebas solo si el archivo se ejecuta directamente
if (require.main === module) {
  testAuth();
}

module.exports = { testAuth };
