# GruaGo API

A Node.js API with PostgreSQL database connection for the GruaGo project.

## Features

- Express.js REST API
- PostgreSQL database integration
- Environment variable configuration
- CORS support
- Complete towing service management system with the following entities:
  - Tenants (companies)
  - Users (customers)
  - Drivers
  - Vehicles
  - Services
  - Tow Requests
  - Invoices
  - Ratings
  - Notifications

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd GruaGo
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=gruago_test
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
