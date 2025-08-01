-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS admin_users;
DROP TABLE IF EXISTS invoice_items;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS tow_requests;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS drivers;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tenants;

-- Create tables
CREATE TABLE tenants ( 
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    contact_email VARCHAR(100), 
    is_active BOOLEAN DEFAULT TRUE, 
    created_at TIMESTAMP DEFAULT NOW() 
); 

CREATE TABLE users ( 
    id SERIAL PRIMARY KEY, 
    tenant_id INTEGER REFERENCES tenants(id), 
    full_name VARCHAR(100), 
    email VARCHAR(100) UNIQUE, 
    phone VARCHAR(20), 
    password_hash TEXT, 
    is_active BOOLEAN DEFAULT TRUE, 
    created_at TIMESTAMP DEFAULT NOW() 
); 

CREATE TABLE drivers ( 
    id SERIAL PRIMARY KEY, 
    tenant_id INTEGER REFERENCES tenants(id), 
    full_name VARCHAR(100), 
    phone VARCHAR(20), 
    license_number VARCHAR(50), 
    is_active BOOLEAN DEFAULT TRUE, 
    created_at TIMESTAMP DEFAULT NOW() 
); 

CREATE TABLE vehicles ( 
    id SERIAL PRIMARY KEY, 
    driver_id INTEGER REFERENCES drivers(id), 
    plate_number VARCHAR(20), 
    vehicle_type VARCHAR(50), 
    brand VARCHAR(50), 
    model VARCHAR(50), 
    year INTEGER, 
    color VARCHAR(30), 
    is_active BOOLEAN DEFAULT TRUE 
); 

CREATE TABLE services ( 
    id SERIAL PRIMARY KEY, 
    tenant_id INTEGER REFERENCES tenants(id), 
    name VARCHAR(50), 
    description TEXT, 
    base_price DECIMAL(10,2), 
    is_active BOOLEAN DEFAULT TRUE, 
    created_at TIMESTAMP DEFAULT NOW() 
); 

CREATE TABLE tow_requests ( 
    id SERIAL PRIMARY KEY, 
    tenant_id INTEGER REFERENCES tenants(id), 
    user_id INTEGER REFERENCES users(id), 
    driver_id INTEGER REFERENCES drivers(id), 
    service_id INTEGER REFERENCES services(id), 
    origin_address TEXT, 
    origin_lat DECIMAL(9,6), 
    origin_lng DECIMAL(9,6), 
    destination_address TEXT, 
    destination_lat DECIMAL(9,6), 
    destination_lng DECIMAL(9,6), 
    distance_km DECIMAL(6,2), 
    total_price DECIMAL(10,2), 
    status VARCHAR(20) DEFAULT 'pending', 
    requested_at TIMESTAMP DEFAULT NOW(), 
    started_at TIMESTAMP, 
    completed_at TIMESTAMP 
); 

CREATE TABLE invoices ( 
    id SERIAL PRIMARY KEY, 
    tenant_id INTEGER REFERENCES tenants(id), 
    request_id INTEGER REFERENCES tow_requests(id), 
    invoice_number VARCHAR(50) UNIQUE, 
    subtotal DECIMAL(10,2), 
    tax DECIMAL(10,2), 
    total DECIMAL(10,2), 
    status VARCHAR(20) DEFAULT 'pending', 
    issued_at TIMESTAMP DEFAULT NOW(), 
    approved_at TIMESTAMP, 
    paid_at TIMESTAMP 
); 

CREATE TABLE invoice_items ( 
    id SERIAL PRIMARY KEY, 
    invoice_id INTEGER REFERENCES invoices(id), 
    description TEXT, 
    quantity INTEGER, 
    unit_price DECIMAL(10,2), 
    total DECIMAL(10,2) 
); 

CREATE TABLE admin_users ( 
    id SERIAL PRIMARY KEY, 
    tenant_id INTEGER REFERENCES tenants(id), 
    username VARCHAR(50) UNIQUE, 
    email VARCHAR(100), 
    password_hash TEXT, 
    role VARCHAR(20) DEFAULT 'admin', 
    created_at TIMESTAMP DEFAULT NOW() 
); 

CREATE TABLE ratings ( 
    id SERIAL PRIMARY KEY, 
    request_id INTEGER REFERENCES tow_requests(id), 
    score INTEGER CHECK (score BETWEEN 1 AND 5), 
    comment TEXT, 
    rated_at TIMESTAMP DEFAULT NOW() 
); 

CREATE TABLE notifications ( 
    id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users(id), 
    title VARCHAR(100), 
    message TEXT, 
    sent_at TIMESTAMP DEFAULT NOW(), 
    read BOOLEAN DEFAULT FALSE 
);