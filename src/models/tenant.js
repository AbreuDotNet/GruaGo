const db = require('../config/db');

class Tenant {
  static async getAll() {
    const query = 'SELECT * FROM tenants ORDER BY id ASC';
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = 'SELECT * FROM tenants WHERE id = $1';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(tenantData) {
    const { name, contact_email, is_active } = tenantData;
    const query = 'INSERT INTO tenants (name, contact_email, is_active) VALUES ($1, $2, $3) RETURNING *';
    try {
      const { rows } = await db.query(query, [name, contact_email, is_active]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, tenantData) {
    const { name, contact_email, is_active } = tenantData;
    const query = 'UPDATE tenants SET name = $1, contact_email = $2, is_active = $3 WHERE id = $4 RETURNING *';
    try {
      const { rows } = await db.query(query, [name, contact_email, is_active, id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM tenants WHERE id = $1 RETURNING *';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Tenant;