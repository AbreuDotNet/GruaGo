const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

console.log('Environment variables:');
console.log('PG_HOST:', process.env.PG_HOST);
console.log('PG_PORT:', process.env.PG_PORT);
console.log('PG_DATABASE:', process.env.PG_DATABASE);
console.log('PG_USER:', process.env.PG_USER);
console.log('PG_PASSWORD:', process.env.PG_PASSWORD ? '***' : 'NOT SET');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

async function checkDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('\n--- Checking database connection ---');
    const result = await client.query('SELECT NOW()');
    console.log('✓ Database connected successfully at:', result.rows[0].now);

    console.log('\n--- Checking tables ---');
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables found:', tables.rows.map(row => row.table_name));

    if (tables.rows.some(row => row.table_name === 'users')) {
      console.log('\n--- Checking users table ---');
      const users = await client.query('SELECT id, full_name, email, is_active FROM users');
      console.log('Users found:', users.rows.length);
      users.rows.forEach(user => {
        console.log(`- ID: ${user.id}, Name: ${user.full_name}, Email: ${user.email}, Active: ${user.is_active}`);
      });
    } else {
      console.log('\n❌ Users table not found!');
    }

    if (tables.rows.some(row => row.table_name === 'tenants')) {
      console.log('\n--- Checking tenants table ---');
      const tenants = await client.query('SELECT id, name, is_active FROM tenants');
      console.log('Tenants found:', tenants.rows.length);
      tenants.rows.forEach(tenant => {
        console.log(`- ID: ${tenant.id}, Name: ${tenant.name}, Active: ${tenant.is_active}`);
      });
    } else {
      console.log('\n❌ Tenants table not found!');
    }

  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    client.release();
    pool.end();
  }
}

checkDatabase();
