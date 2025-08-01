const User = require('../models/user');

class UserController {
  // Get all users
  static async getAllUsers(req, res) {
    try {
      const users = await User.getAll();
      return res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Get single user
  static async getUserById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const user = await User.getById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Create new user
  static async createUser(req, res) {
    try {
      const { tenant_id, full_name, email, phone, password_hash } = req.body;

      if (!full_name || !email) {
        return res.status(400).json({
          success: false,
          error: 'Please provide full name and email'
        });
      }

      const userData = { 
        tenant_id, 
        full_name, 
        email, 
        phone, 
        password_hash,
        is_active: true
      };
      const newUser = await User.create(userData);

      return res.status(201).json({
        success: true,
        data: newUser
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      const user = await User.getById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const { tenant_id, full_name, email, phone, password_hash, is_active } = req.body;
      const userData = { 
        tenant_id: tenant_id || user.tenant_id, 
        full_name: full_name || user.full_name, 
        email: email || user.email, 
        phone: phone || user.phone,
        password_hash: password_hash || user.password_hash,
        is_active: is_active !== undefined ? is_active : user.is_active
      };

      const updatedUser = await User.update(id, userData);

      return res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      const user = await User.getById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      await User.delete(id);

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

module.exports = UserController;