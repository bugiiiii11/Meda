//server/src/controllers/UserController.js
const mongoose = require('mongoose');
const User = require('../models/User');

class UserController {
  static async createUser(req, res) {
    try {
      const { telegramId, username, firstName, lastName } = req.body;
      console.log('Creating/updating user:', { telegramId, username, firstName, lastName });
  
      let user = await User.findOne({ telegramId });
      
      if (user) {
        // Update existing user
        user.username = username || user.username;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        await user.save();
        console.log('Updated existing user:', user);
      } else {
        // Create new user
        user = new User({
          telegramId,
          username: username || `user${telegramId.slice(-4)}`,
          firstName,
          lastName,
          totalPoints: 0,
          pointsBreakdown: {
            likes: 0,
            dislikes: 0,
            superLikes: 0,
            tasks: 0,
            referrals: 0
          }
        });
        await user.save();
        console.log('Created new user:', user);
      }
  
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getUser(req, res) {
    try {
      let user = await User.findOne({ telegramId: req.params.telegramId });
      if (!user) {
        user = new User({
          telegramId: req.params.telegramId,
          username: req.query.username || `user${req.params.telegramId.slice(-4)}`,
          totalPoints: 0,
          pointsBreakdown: { likes: 0, dislikes: 0, superLikes: 0 }
        });
        await user.save();
      }
      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getUserStats(req, res) {
    try {
      const { telegramId } = req.params;
      
      const user = await User.findOne({ telegramId })
        .select('telegramId username totalPoints pointsBreakdown completedTasks');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Get user's rank
      const rank = await User.countDocuments({
        totalPoints: { $gt: user.totalPoints }
      }) + 1;

      res.json({
        success: true,
        data: {
          user: {
            telegramId: user.telegramId,
            username: user.username,
            rank,
            totalPoints: user.totalPoints,
            pointsBreakdown: user.pointsBreakdown,
            completedTasks: user.completedTasks.length
          }
        }
      });
    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = UserController;