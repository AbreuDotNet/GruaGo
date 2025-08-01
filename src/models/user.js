const db = require('../config/db');

class User {
  static async getAll() {
    const query = 'SELECT * FROM users ORDER BY id ASC';
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    const { tenant_id, full_name, email, phone, password_hash, is_active } = userData;
    const query = 'INSERT INTO users (tenant_id, full_name, email, phone, password_hash, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    try {
      const { rows } = await db.query(query, [tenant_id, full_name, email, phone, password_hash, is_active]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userData) {
    const { tenant_id, full_name, email, phone, password_hash, is_active } = userData;
    const query = 'UPDATE users SET tenant_id = $1, full_name = $2, email = $3, phone = $4, password_hash = $5, is_active = $6 WHERE id = $7 RETURNING *';
    try {
      const { rows } = await db.query(query, [tenant_id, full_name, email, phone, password_hash, is_active, id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;