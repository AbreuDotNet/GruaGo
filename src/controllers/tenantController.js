const Tenant = require('../models/tenant');

class TenantController {
  // Get all tenants
  static async getAllTenants(req, res) {
    try {
      const tenants = await Tenant.getAll();
      return res.status(200).json({
        success: true,
        count: tenants.length,
        data: tenants
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get single tenant
  static async getTenantById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const tenant = await Tenant.getById(id);
      
      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: 'Tenant not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: tenant
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Create new tenant
  static async createTenant(req, res) {
    try {
      const { name, contact_email } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          error: 'Please provide tenant name'
        });
      }

      const tenantData = { 
        name, 
        contact_email, 
        is_active: true 
      };
      const newTenant = await Tenant.create(tenantData);

      return res.status(201).json({
        success: true,
        data: newTenant
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Update tenant
  static async updateTenant(req, res) {
    try {
      const id = parseInt(req.params.id);
      const tenant = await Tenant.getById(id);
      
      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: 'Tenant not found'
        });
      }

      const { name, contact_email, is_active } = req.body;
      const tenantData = { 
        name: name || tenant.name, 
        contact_email: contact_email || tenant.contact_email, 
        is_active: is_active !== undefined ? is_active : tenant.is_active 
      };

      const updatedTenant = await Tenant.update(id, tenantData);

      return res.status(200).json({
        success: true,
        data: updatedTenant
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Delete tenant
  static async deleteTenant(req, res) {
    try {
      const id = parseInt(req.params.id);
      const tenant = await Tenant.getById(id);
      
      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: 'Tenant not found'
        });
      }

      await Tenant.delete(id);

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

module.exports = TenantController;