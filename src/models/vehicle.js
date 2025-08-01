const db = require('../config/db');

class Vehicle {
  static async getAll() {
    const query = 'SELECT * FROM vehicles ORDER BY id ASC';
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByDriverId(driverId) {
    const query = 'SELECT * FROM vehicles WHERE driver_id = $1 ORDER BY id ASC';
    try {
      const { rows } = await db.query(query, [driverId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = 'SELECT * FROM vehicles WHERE id = $1';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(vehicleData) {
    const { driver_id, plate_number, vehicle_type, brand, model, year, color, is_active } = vehicleData;
    const query = 'INSERT INTO vehicles (driver_id, plate_number, vehicle_type, brand, model, year, color, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    try {
      const { rows } = await db.query(query, [driver_id, plate_number, vehicle_type, brand, model, year, color, is_active]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, vehicleData) {
    const { driver_id, plate_number, vehicle_type, brand, model, year, color, is_active } = vehicleData;
    const query = 'UPDATE vehicles SET driver_id = $1, plate_number = $2, vehicle_type = $3, brand = $4, model = $5, year = $6, color = $7, is_active = $8 WHERE id = $9 RETURNING *';
    try {
      const { rows } = await db.query(query, [driver_id, plate_number, vehicle_type, brand, model, year, color, is_active, id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM vehicles WHERE id = $1 RETURNING *';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Vehicle;