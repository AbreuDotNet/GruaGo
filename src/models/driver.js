const db = require('../config/db');

class Driver {
  static async getAll() {
    const query = 'SELECT * FROM drivers ORDER BY id ASC';
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByTenantId(tenantId) {
    const query = 'SELECT * FROM drivers WHERE tenant_id = $1 ORDER BY id ASC';
    try {
      const { rows } = await db.query(query, [tenantId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = 'SELECT * FROM drivers WHERE id = $1';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(driverData) {
    const { tenant_id, full_name, phone, license_number, is_active } = driverData;
    const query = 'INSERT INTO drivers (tenant_id, full_name, phone, license_number, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    try {
      const { rows } = await db.query(query, [tenant_id, full_name, phone, license_number, is_active]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, driverData) {
    const { tenant_id, full_name, phone, license_number, is_active } = driverData;
    const query = 'UPDATE drivers SET tenant_id = $1, full_name = $2, phone = $3, license_number = $4, is_active = $5 WHERE id = $6 RETURNING *';
    try {
      const { rows } = await db.query(query, [tenant_id, full_name, phone, license_number, is_active, id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM drivers WHERE id = $1 RETURNING *';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Driver;