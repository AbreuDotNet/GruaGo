const db = require('../config/db');

class TowRequest {
  static async getAll() {
    const query = 'SELECT * FROM tow_requests ORDER BY id ASC';
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByTenantId(tenantId) {
    const query = 'SELECT * FROM tow_requests WHERE tenant_id = $1 ORDER BY requested_at DESC';
    try {
      const { rows } = await db.query(query, [tenantId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByUserId(userId) {
    const query = 'SELECT * FROM tow_requests WHERE user_id = $1 ORDER BY requested_at DESC';
    try {
      const { rows } = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getByDriverId(driverId) {
    const query = 'SELECT * FROM tow_requests WHERE driver_id = $1 ORDER BY requested_at DESC';
    try {
      const { rows } = await db.query(query, [driverId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    const query = 'SELECT * FROM tow_requests WHERE id = $1';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async create(requestData) {
    const { 
      tenant_id, 
      user_id, 
      service_id, 
      origin_address, 
      origin_lat, 
      origin_lng, 
      destination_address, 
      destination_lat, 
      destination_lng, 
      distance_km, 
      total_price 
    } = requestData;
    
    const query = `
      INSERT INTO tow_requests (
        tenant_id, user_id, service_id, origin_address, origin_lat, origin_lng, 
        destination_address, destination_lat, destination_lng, distance_km, total_price, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
    `;
    
    try {
      const { rows } = await db.query(query, [
        tenant_id, user_id, service_id, origin_address, origin_lat, origin_lng,
        destination_address, destination_lat, destination_lng, distance_km, total_price, 'pending'
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, requestData) {
    // Get the current request data
    const currentRequest = await this.getById(id);
    if (!currentRequest) {
      throw new Error('Tow request not found');
    }

    const { 
      tenant_id, 
      user_id, 
      driver_id, 
      service_id, 
      origin_address, 
      origin_lat, 
      origin_lng, 
      destination_address, 
      destination_lat, 
      destination_lng, 
      distance_km, 
      total_price, 
      status,
      started_at,
      completed_at
    } = requestData;
    
    const query = `
      UPDATE tow_requests SET 
        tenant_id = $1, 
        user_id = $2, 
        driver_id = $3, 
        service_id = $4, 
        origin_address = $5, 
        origin_lat = $6, 
        origin_lng = $7, 
        destination_address = $8, 
        destination_lat = $9, 
        destination_lng = $10, 
        distance_km = $11, 
        total_price = $12, 
        status = $13,
        started_at = $14,
        completed_at = $15
      WHERE id = $16 RETURNING *
    `;
    
    try {
      const { rows } = await db.query(query, [
        tenant_id || currentRequest.tenant_id,
        user_id || currentRequest.user_id,
        driver_id !== undefined ? driver_id : currentRequest.driver_id,
        service_id || currentRequest.service_id,
        origin_address || currentRequest.origin_address,
        origin_lat !== undefined ? origin_lat : currentRequest.origin_lat,
        origin_lng !== undefined ? origin_lng : currentRequest.origin_lng,
        destination_address || currentRequest.destination_address,
        destination_lat !== undefined ? destination_lat : currentRequest.destination_lat,
        destination_lng !== undefined ? destination_lng : currentRequest.destination_lng,
        distance_km !== undefined ? distance_km : currentRequest.distance_km,
        total_price !== undefined ? total_price : currentRequest.total_price,
        status || currentRequest.status,
        started_at !== undefined ? started_at : currentRequest.started_at,
        completed_at !== undefined ? completed_at : currentRequest.completed_at,
        id
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateStatus(id, status, driverId = null) {
    let query;
    let params;
    
    if (status === 'assigned' && driverId) {
      query = 'UPDATE tow_requests SET status = $1, driver_id = $2 WHERE id = $3 RETURNING *';
      params = [status, driverId, id];
    } else if (status === 'in_progress') {
      query = 'UPDATE tow_requests SET status = $1, started_at = NOW() WHERE id = $2 RETURNING *';
      params = [status, id];
    } else if (status === 'completed') {
      query = 'UPDATE tow_requests SET status = $1, completed_at = NOW() WHERE id = $2 RETURNING *';
      params = [status, id];
    } else {
      query = 'UPDATE tow_requests SET status = $1 WHERE id = $2 RETURNING *';
      params = [status, id];
    }
    
    try {
      const { rows } = await db.query(query, params);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = 'DELETE FROM tow_requests WHERE id = $1 RETURNING *';
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TowRequest;