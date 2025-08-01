const db = require('../config/db');

class Service {
  static async getAll() {
    const query = 'SELECT * FROM services ORDER BY id ASC';
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByTenantId(tenantId) {
    const query = 'SELECT * FROM services WHERE tenant_id = $1 ORDER BY id ASC';
    try {
      const { rows } = await db.query(query, [tenantId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = 'SELECT * FROM services WHERE id = $1';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(serviceData) {
    const { tenant_id, name, description, base_price, is_active } = serviceData;
    const query = 'INSERT INTO services (tenant_id, name, description, base_price, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    try {
      const { rows } = await db.query(query, [tenant_id, name, description, base_price, is_active]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, serviceData) {
    const { tenant_id, name, description, base_price, is_active } = serviceData;
    const query = 'UPDATE services SET tenant_id = $1, name = $2, description = $3, base_price = $4, is_active = $5 WHERE id = $6 RETURNING *';
    try {
      const { rows } = await db.query(query, [tenant_id, name, description, base_price, is_active, id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM services WHERE id = $1 RETURNING *';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Service;