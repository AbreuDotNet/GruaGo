const Service = require('../models/service');

class ServiceController {
  // Get all services
  static async getAllServices(req, res) {
    try {
      const services = await Service.getAll();
      return res.status(200).json({
        success: true,
        count: services.length,
        data: services
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get services by tenant ID
  static async getServicesByTenant(req, res) {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const services = await Service.getByTenantId(tenantId);
      
      return res.status(200).json({
        success: true,
        count: services.length,
        data: services
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get single service
  static async getServiceById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const service = await Service.getById(id);
      
      if (!service) {
        return res.status(404).json({
          success: false,
          error: 'Service not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: service
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Create new service
  static async createService(req, res) {
    try {
      const { tenant_id, name, description, base_price } = req.body;

      if (!tenant_id || !name) {
        return res.status(400).json({
          success: false,
          error: 'Please provide tenant ID and service name'
        });
      }

      const serviceData = { 
        tenant_id, 
        name, 
        description, 
        base_price: base_price || 0,
        is_active: true 
      };
      const newService = await Service.create(serviceData);

      return res.status(201).json({
        success: true,
        data: newService
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Update service
  static async updateService(req, res) {
    try {
      const id = parseInt(req.params.id);
      const service = await Service.getById(id);
      
      if (!service) {
        return res.status(404).json({
          success: false,
          error: 'Service not found'
        });
      }

      const { tenant_id, name, description, base_price, is_active } = req.body;
      const serviceData = { 
        tenant_id: tenant_id || service.tenant_id, 
        name: name || service.name, 
        description: description || service.description, 
        base_price: base_price !== undefined ? base_price : service.base_price,
        is_active: is_active !== undefined ? is_active : service.is_active 
      };

      const updatedService = await Service.update(id, serviceData);

      return res.status(200).json({
        success: true,
        data: updatedService
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Delete service
  static async deleteService(req, res) {
    try {
      const id = parseInt(req.params.id);
      const service = await Service.getById(id);
      
      if (!service) {
        return res.status(404).json({
          success: false,
          error: 'Service not found'
        });
      }

      await Service.delete(id);

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

module.exports = ServiceController;