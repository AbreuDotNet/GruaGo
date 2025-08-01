const Driver = require('../models/driver');

class DriverController {
  // Get all drivers
  static async getAllDrivers(req, res) {
    try {
      const drivers = await Driver.getAll();
      return res.status(200).json({
        success: true,
        count: drivers.length,
        data: drivers
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get drivers by tenant ID
  static async getDriversByTenant(req, res) {
    try {
      const tenantId = parseInt(req.params.tenantId);
      const drivers = await Driver.getByTenantId(tenantId);
      
      return res.status(200).json({
        success: true,
        count: drivers.length,
        data: drivers
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get single driver
  static async getDriverById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const driver = await Driver.getById(id);
      
      if (!driver) {
        return res.status(404).json({
          success: false,
          error: 'Driver not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: driver
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Create new driver
  static async createDriver(req, res) {
    try {
      const { tenant_id, full_name, phone, license_number } = req.body;

      if (!tenant_id || !full_name) {
        return res.status(400).json({
          success: false,
          error: 'Please provide tenant ID and full name'
        });
      }

      const driverData = { 
        tenant_id, 
        full_name, 
        phone, 
        license_number,
        is_active: true 
      };
      const newDriver = await Driver.create(driverData);

      return res.status(201).json({
        success: true,
        data: newDriver
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Update driver
  static async updateDriver(req, res) {
    try {
      const id = parseInt(req.params.id);
      const driver = await Driver.getById(id);
      
      if (!driver) {
        return res.status(404).json({
          success: false,
          error: 'Driver not found'
        });
      }

      const { tenant_id, full_name, phone, license_number, is_active } = req.body;
      const driverData = { 
        tenant_id: tenant_id || driver.tenant_id, 
        full_name: full_name || driver.full_name, 
        phone: phone || driver.phone, 
        license_number: license_number || driver.license_number,
        is_active: is_active !== undefined ? is_active : driver.is_active 
      };

      const updatedDriver = await Driver.update(id, driverData);

      return res.status(200).json({
        success: true,
        data: updatedDriver
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Delete driver
  static async deleteDriver(req, res) {
    try {
      const id = parseInt(req.params.id);
      const driver = await Driver.getById(id);
      
      if (!driver) {
        return res.status(404).json({
          success: false,
          error: 'Driver not found'
        });
      }

      await Driver.delete(id);

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

module.exports = DriverController;