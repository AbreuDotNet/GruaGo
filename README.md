# 🚛 GruaGo - Sistema de Gestión de Grúas

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D12.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Sistema completo de gestión de servicios de grúas con backend API REST, dashboard administrativo y base de datos PostgreSQL.

## 🚀 Características

### Backend API
- **API REST completa** con Node.js y Express
- **Base de datos PostgreSQL** con esquema optimizado
- **Autenticación y autorización** por roles
- **CORS configurado** para desarrollo y producción
- **Validación de datos** en todas las rutas

### Frontend Dashboard
- **Dashboard administrativo** con React y Vite
- **Interfaz responsiva** con diseño moderno
- **Métricas en tiempo real** del sistema
- **Gestión completa** de todas las entidades

### Sistema de Entidades
- 👥 **Tenants** - Empresas de grúas
- 🙋‍♂️ **Users** - Clientes del servicio
- 🚗 **Drivers** - Conductores de grúas
- 🚛 **Vehicles** - Flota de vehículos
- ⚙️ **Services** - Tipos de servicios ofrecidos
- 🚨 **Tow Requests** - Solicitudes de servicio
- 💰 **Invoices** - Facturación automática
- ⭐ **Ratings** - Sistema de calificaciones

## 📋 Prerequisitos

- **Node.js** v16.0.0 o superior
- **PostgreSQL** v12.0.0 o superior
- **npm** o **yarn** para gestión de paquetes

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/AbreuDotNet/GruaGo.git
cd GruaGo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos PostgreSQL

Crear una base de datos llamada `gruago_test`:

```sql
CREATE DATABASE gruago_test;
```

Ejecutar el script de inicialización:

```bash
psql -U postgres -d gruago_test -f src/config/init.sql
```

### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=3000

# Base de datos PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=gruago_test
PG_USER=postgres
PG_PASSWORD=tu_password_aqui
```

### 5. Poblar con datos de prueba (Opcional)

```bash
node insert-sample-data.js
```

## 🚀 Uso

### Iniciar el servidor API

```bash
# Modo desarrollo
node src/server.js

# O con nodemon para auto-reload
npx nodemon src/server.js
```

El servidor estará disponible en: `http://localhost:3000`

### Iniciar el dashboard frontend

```bash
# Modo desarrollo
npm run dev
```

El dashboard estará disponible en: `http://localhost:5173`

## 🧪 Pruebas

### Probar conexión a la base de datos

```bash
node test-db.js
```

### Probar endpoints de la API

```bash
node test-api.js
```

## 📡 API Endpoints

### Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Conductores
- `GET /api/drivers` - Obtener todos los conductores
- `GET /api/drivers/:id` - Obtener conductor por ID
- `POST /api/drivers` - Crear nuevo conductor
- `PUT /api/drivers/:id` - Actualizar conductor
- `DELETE /api/drivers/:id` - Eliminar conductor

### Vehículos
- `GET /api/vehicles` - Obtener todos los vehículos
- `GET /api/vehicles/:id` - Obtener vehículo por ID
- `POST /api/vehicles` - Crear nuevo vehículo
- `PUT /api/vehicles/:id` - Actualizar vehículo
- `DELETE /api/vehicles/:id` - Eliminar vehículo

### Solicitudes de Grúa
- `GET /api/tow-requests` - Obtener todas las solicitudes
- `GET /api/tow-requests/:id` - Obtener solicitud por ID
- `POST /api/tow-requests` - Crear nueva solicitud
- `PUT /api/tow-requests/:id` - Actualizar solicitud
- `DELETE /api/tow-requests/:id` - Eliminar solicitud

### Servicios
- `GET /api/services` - Obtener todos los servicios
- `GET /api/services/:id` - Obtener servicio por ID
- `POST /api/services` - Crear nuevo servicio
- `PUT /api/services/:id` - Actualizar servicio
- `DELETE /api/services/:id` - Eliminar servicio

### Empresas (Tenants)
- `GET /api/tenants` - Obtener todas las empresas
- `GET /api/tenants/:id` - Obtener empresa por ID
- `POST /api/tenants` - Crear nueva empresa
- `PUT /api/tenants/:id` - Actualizar empresa
- `DELETE /api/tenants/:id` - Eliminar empresa

## 🗂️ Estructura del Proyecto

```
GruaGo/
├── src/
│   ├── config/
│   │   ├── db.js              # Configuración de la base de datos
│   │   └── init.sql           # Script de inicialización de tablas
│   ├── controllers/           # Controladores de la API
│   │   ├── userController.js
│   │   ├── driverController.js
│   │   ├── vehicleController.js
│   │   ├── towRequestController.js
│   │   ├── serviceController.js
│   │   └── tenantController.js
│   ├── models/                # Modelos de datos
│   │   ├── user.js
│   │   ├── driver.js
│   │   ├── vehicle.js
│   │   ├── towRequest.js
│   │   ├── service.js
│   │   └── tenant.js
│   ├── routes/                # Definición de rutas
│   │   ├── userRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── towRequestRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── tenantRoutes.js
│   ├── services/
│   │   └── apiService.js      # Servicios auxiliares
│   ├── App.tsx                # Dashboard React
│   ├── App.css                # Estilos del dashboard
│   └── server.js              # Servidor principal Express
├── public/                    # Archivos estáticos
├── insert-sample-data.js      # Script para datos de prueba
├── test-api.js               # Pruebas de endpoints
├── test-db.js                # Prueba de conexión DB
├── package.json              # Dependencias del proyecto
└── README.md                 # Este archivo
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar dashboard en modo desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de build de producción

# Base de datos
node test-db.js      # Probar conexión a PostgreSQL
node insert-sample-data.js  # Insertar datos de prueba

# API
node src/server.js   # Iniciar servidor API
node test-api.js     # Probar todos los endpoints
```

## 🔒 Seguridad

- Variables de entorno para configuración sensible
- Validación de entrada en todos los endpoints
- Preparado para implementar JWT authentication
- CORS configurado apropiadamente

## 🚧 Próximas Funcionalidades

- [ ] Autenticación JWT completa
- [ ] Sistema de roles y permisos
- [ ] Notificaciones en tiempo real
- [ ] Integración con mapas (GPS tracking)
- [ ] App móvil con Ionic
- [ ] Sistema de pagos
- [ ] Reportes y analytics
- [ ] API de geolocalización

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Daniel Abreu** - [@AbreuDotNet](https://github.com/AbreuDotNet)

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- Crear un [Issue](https://github.com/AbreuDotNet/GruaGo/issues)
- Email: danielabreu2310@hotmail.com

---

⭐ **¡Si te gusta este proyecto, dale una estrella!** ⭐
PG_USER=gruago_test
PG_PASSWORD=
```

4. Set up the PostgreSQL database

- Create a database named `gruago_test`
- Create a user named `gruago_test` without password
- Run the SQL script in `src/config/init.sql` to create tables and sample data

## Running the Application

```bash
node src/server.js
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Tenants

- `GET /api/tenants` - Get all tenants
- `GET /api/tenants/:id` - Get a specific tenant
- `POST /api/tenants` - Create a new tenant
- `PUT /api/tenants/:id` - Update a tenant
- `DELETE /api/tenants/:id` - Delete a tenant

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Drivers

- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/tenant/:tenantId` - Get drivers by tenant
- `GET /api/drivers/:id` - Get a specific driver
- `POST /api/drivers` - Create a new driver
- `PUT /api/drivers/:id` - Update a driver
- `DELETE /api/drivers/:id` - Delete a driver

### Vehicles

- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/driver/:driverId` - Get vehicles by driver
- `GET /api/vehicles/:id` - Get a specific vehicle
- `POST /api/vehicles` - Create a new vehicle
- `PUT /api/vehicles/:id` - Update a vehicle
- `DELETE /api/vehicles/:id` - Delete a vehicle

### Services

- `GET /api/services` - Get all services
- `GET /api/services/tenant/:tenantId` - Get services by tenant
- `GET /api/services/:id` - Get a specific service
- `POST /api/services` - Create a new service
- `PUT /api/services/:id` - Update a service
- `DELETE /api/services/:id` - Delete a service

### Tow Requests

- `GET /api/tow-requests` - Get all tow requests
- `GET /api/tow-requests/tenant/:tenantId` - Get tow requests by tenant
- `GET /api/tow-requests/user/:userId` - Get tow requests by user
- `GET /api/tow-requests/driver/:driverId` - Get tow requests by driver
- `GET /api/tow-requests/:id` - Get a specific tow request
- `POST /api/tow-requests` - Create a new tow request
- `PUT /api/tow-requests/:id` - Update a tow request
- `PATCH /api/tow-requests/:id/status` - Update tow request status
- `DELETE /api/tow-requests/:id` - Delete a tow request

### Example Requests

```bash
# Create a new tenant
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{"name":"ABC Towing","contact_email":"contact@abctowing.com"}'

# Create a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"tenant_id":1,"full_name":"John Doe","email":"john@example.com","phone":"555-1234"}'

# Create a new tow request
curl -X POST http://localhost:3000/api/tow-requests \
  -H "Content-Type: application/json" \
  -d '{"tenant_id":1,"user_id":1,"service_id":1,"origin_address":"123 Main St","destination_address":"456 Oak Ave"}'
```

## Project Structure

```
├── .env                  # Environment variables
├── package.json          # Project dependencies
├── src/
│   ├── config/           # Configuration files
│   │   ├── db.js         # Database connection
│   │   └── init.sql      # SQL initialization script
│   ├── controllers/      # Request handlers
│   │   ├── userController.js
│   │   ├── tenantController.js
│   │   ├── driverController.js
│   │   ├── vehicleController.js
│   │   ├── serviceController.js
│   │   └── towRequestController.js
│   ├── models/           # Database models
│   │   ├── user.js
│   │   ├── tenant.js
│   │   ├── driver.js
│   │   ├── vehicle.js
│   │   ├── service.js
│   │   └── towRequest.js
│   ├── routes/           # API routes
│   │   ├── userRoutes.js
│   │   ├── tenantRoutes.js
│   │   ├── driverRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── towRequestRoutes.js
│   └── server.js         # Main application file
```

## License

MIT
