const TowRequest = require('../models/towRequest');

class TowRequestController {
  // Get all tow requests
  static async getAllRequests(req, res) {
    try {
      const requests = await TowRequest.getAll();
      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get tow requests by tenant ID
  static async getRequestsByTenant(req, res) {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const requests = await TowRequest.getByTenantId(tenantId);
      
      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get tow requests by user ID
  static async getRequestsByUser(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      const requests = await TowRequest.getByUserId(userId);
      
      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get tow requests by driver ID
  static async getRequestsByDriver(req, res) {
    try {
      const driverId = parseInt(req.params.driverId);
      const requests = await TowRequest.getByDriverId(driverId);
      
      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get single tow request
  static async getRequestById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const request = await TowRequest.getById(id);
      
      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Tow request not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: request
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Create new tow request
  static async createRequest(req, res) {
    try {
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
      } = req.body;

      if (!tenant_id || !user_id || !service_id || !origin_address || !destination_address) {
        return res.status(400).json({
          success: false,
          error: 'Please provide all required fields'
        });
      }

      const requestData = { 
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
      };
      
      const newRequest = await TowRequest.create(requestData);

      return res.status(201).json({
        success: true,
        data: newRequest
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Update tow request
  static async updateRequest(req, res) {
    try {
      const id = parseInt(req.params.id);
      const request = await TowRequest.getById(id);
      
      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Tow request not found'
        });
      }

      const updatedRequest = await TowRequest.update(id, req.body);

      return res.status(200).json({
        success: true,
        data: updatedRequest
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Update tow request status
  static async updateRequestStatus(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { status, driver_id } = req.body;
      
      if (!status) {
        return res.status(400).json({
          success: false,
          error: 'Please provide status'
        });
      }

      const request = await TowRequest.getById(id);
      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Tow request not found'
        });
      }

      // Validate status transitions
      const validStatuses = ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status value'
        });
      }

      // Check if driver_id is provided when status is 'assigned'
      if (status === 'assigned' && !driver_id) {
        return res.status(400).json({
          success: false,
          error: 'Driver ID is required when assigning a request'
        });
      }

      const updatedRequest = await TowRequest.updateStatus(id, status, driver_id);

      return res.status(200).json({
        success: true,
        data: updatedRequest
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Delete tow request
  static async deleteRequest(req, res) {
    try {
      const id = parseInt(req.params.id);
      const request = await TowRequest.getById(id);
      
      if (!request) {
        return res.status(404).json({
          success: false,
          error: 'Tow request not found'
        });
      }

      // Only allow deletion of pending requests
      if (request.status !== 'pending') {
        return res.status(400).json({
          success: false,
          error: 'Only pending requests can be deleted'
        });
      }

      await TowRequest.delete(id);

      return res.status(200).json({
        success: true,
        data: {}
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
}

module.exports = TowRequestController;