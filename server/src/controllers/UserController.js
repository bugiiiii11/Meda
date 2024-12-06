//server/src/controllers/UserController.js
const mongoose = require('mongoose');
const User = require('../models/User');

class UserController {
  static async createUser(req, res) {
    try {
      const { telegramId, username } = req.body;
      console.log('Creating user with data:', req.body);
      
      // Check if user exists
      let user = await User.findOne({ telegramId });
      console.log('Existing user:', user);
  
      if (!user) {
        user = new User({
          telegramId,
          username
        });
        await user.save();
        console.log('New user created:', user);
      }
  
      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, error: error.message });
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