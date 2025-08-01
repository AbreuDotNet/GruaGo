const Vehicle = require('../models/vehicle');

class VehicleController {
  // Get all vehicles
  static async getAllVehicles(req, res) {
    try {
      const vehicles = await Vehicle.getAll();
      return res.status(200).json({
        success: true,
        count: vehicles.length,
        data: vehicles
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get vehicles by driver ID
  static async getVehiclesByDriver(req, res) {
    try {
      const driverId = parseInt(req.params.driverId);
      const vehicles = await Vehicle.getByDriverId(driverId);
      
      return res.status(200).json({
        success: true,
        count: vehicles.length,
        data: vehicles
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get single vehicle
  static async getVehicleById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await Vehicle.getById(id);
      
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: vehicle
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Create new vehicle
  static async createVehicle(req, res) {
    try {
      const { driver_id, plate_number, vehicle_type, brand, model, year, color } = req.body;

      if (!driver_id || !plate_number) {
        return res.status(400).json({
          success: false,
          error: 'Please provide driver ID and plate number'
        });
      }

      const vehicleData = { 
        driver_id, 
        plate_number, 
        vehicle_type, 
        brand, 
        model, 
        year, 
        color,
        is_active: true 
      };
      const newVehicle = await Vehicle.create(vehicleData);

      return res.status(201).json({
        success: true,
        data: newVehicle
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Update vehicle
  static async updateVehicle(req, res) {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await Vehicle.getById(id);
      
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      const { driver_id, plate_number, vehicle_type, brand, model, year, color, is_active } = req.body;
      const vehicleData = { 
        driver_id: driver_id || vehicle.driver_id, 
        plate_number: plate_number || vehicle.plate_number, 
        vehicle_type: vehicle_type || vehicle.vehicle_type, 
        brand: brand || vehicle.brand, 
        model: model || vehicle.model, 
        year: year || vehicle.year, 
        color: color || vehicle.color,
        is_active: is_active !== undefined ? is_active : vehicle.is_active 
      };

      const updatedVehicle = await Vehicle.update(id, vehicleData);

      return res.status(200).json({
        success: true,
        data: updatedVehicle
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Delete vehicle
  static async deleteVehicle(req, res) {
    try {
      const id = parseInt(req.params.id);
      const vehicle = await Vehicle.getById(id);
      
      if (!vehicle) {
        return res.status(404).json({
          success: false,
          error: 'Vehicle not found'
        });
      }

      await Vehicle.delete(id);

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

module.exports = VehicleController;