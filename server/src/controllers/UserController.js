//UserController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const ReferralController = require('../controllers/ReferralController');
const WhitelistedUser = require('../models/WhitelistedUser');

class UserController {
  static async createUser(req, res) {
    console.log('Received user creation request:', {
      body: req.body,
      headers: req.headers,
      telegramUser: req.telegramUser
    });
  
    try {
      const { telegramId, username, firstName, lastName, referralId } = req.body;
      
      if (!telegramId) {
        console.error('Missing telegramId in request');
        return res.status(400).json({
          success: false,
          error: 'telegramId is required'
        });
      }
  
      // Check if user exists
      let user = await User.findOne({ telegramId });
      console.log('Existing user found:', user);
  
      if (!user) {
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
  
        // Handle referral if present
        if (referralId) {
          console.log('Processing referral:', { referralId, newUserId: telegramId });
          
          const referrer = await User.findOne({ telegramId: referralId });
          if (referrer) {
            // Update new user
            user.referralStats.referredBy = referralId;
            
            // Update referrer
            referrer.referralStats.referredUsers.push(telegramId);
            referrer.referralStats.totalReferralPoints += 20;
            referrer.totalPoints += 20;
            referrer.pointsBreakdown.referrals += 20;
            
            await referrer.save();
            console.log('Updated referrer:', {
              telegramId: referrer.telegramId,
              referredUsers: referrer.referralStats.referredUsers,
              totalReferralPoints: referrer.referralStats.totalReferralPoints
            });
          }
        }
  
        await user.save();
        console.log('Created new user:', user);
      } else {
        // Update existing user
        user.username = username || user.username;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.lastActive = new Date();
        await user.save();
        console.log('Updated existing user:', user);
      }
  
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Create user error:', {
        error: error.message,
        stack: error.stack
      });
      res.status(500).json({
        success: false,
        error: 'Failed to create/update user',
        details: error.message
      });
    }
  }

  static async getUser(req, res) {
    try {
      const { telegramId } = req.params;
      console.log('Getting user:', telegramId);

      let user = await User.findOne({ telegramId });
      console.log('Found user:', user);

      if (!user) {
        console.log('User not found, creating new user');
        user = new User({
          telegramId,
          username: req.query.username || `user${telegramId.slice(-4)}`,
          totalPoints: 0,
          pointsBreakdown: {
            likes: 0,
            dislikes: 0,
            superLikes: 0,
            tasks: 0,
            referrals: 0
          },
          referralStats: {
            referredUsers: [],
            totalReferralPoints: 0
          }
        });
        await user.save();
        console.log('Created new user:', user);
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getUserStats(req, res) {
    try {
      const { telegramId } = req.params;
      console.log('Getting stats for user:', telegramId);

      const user = await User.findOne({ telegramId })
        .select('telegramId username totalPoints pointsBreakdown completedTasks referralStats referredBy');

      if (!user) {
        console.log('User not found for stats:', telegramId);
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Get user's rank
      const rank = await User.countDocuments({
        totalPoints: { $gt: user.totalPoints }
      }) + 1;

      console.log('User stats:', {
        telegramId: user.telegramId,
        username: user.username,
        rank,
        totalPoints: user.totalPoints,
        referrals: user.referralStats?.referredUsers?.length || 0
      });

      res.json({
        success: true,
        data: {
          user: {
            telegramId: user.telegramId,
            username: user.username,
            rank,
            totalPoints: user.totalPoints,
            pointsBreakdown: user.pointsBreakdown,
            completedTasks: user.completedTasks?.length || 0,
            referralStats: user.referralStats,
            referredBy: user.referredBy
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

  static async checkWhitelist(req, res) {
    try {
      const { telegramId } = req.params;
      
      if (!telegramId) {
        return res.status(400).json({
          success: false,
          error: 'telegramId is required'
        });
      }
  
      const isWhitelisted = await WhitelistedUser.findOne({ telegramId });
      
      res.json({
        success: true,
        data: {
          isWhitelisted: !!isWhitelisted
        }
      });
    } catch (error) {
      console.error('Whitelist check error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

}

module.exports = UserController;