const mongoose = require('mongoose');
const User = require('../models/User');
const ReferralController = require('../controllers/ReferralController');

class UserController {
  static async createUser(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const { telegramId, username, firstName, lastName, referredBy } = req.body;
      console.log('Creating/updating user:', { telegramId, username, referredBy });
  
      let user = await User.findOne({ telegramId });
  
      if (user) {
        // Update existing user
        user.username = username || user.username;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
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
          },
          referralStats: {
            referredUsers: [],
            totalReferralPoints: 0
          }
        });
      }

      // Handle referral if provided and user hasn't been referred yet
      if (referredBy && !user.referredBy) {
        console.log('Processing referral:', { referredBy, newUser: telegramId });
        
        try {
          const referralResult = await ReferralController.redeemReferral({
            body: {
              referralCode: referredBy,
              newUserTelegramId: telegramId,
              username: username
            }
          }, {
            json: (data) => {
              console.log('Referral processed:', data);
              return data;
            },
            status: (code) => ({
              json: (data) => {
                console.log('Referral response:', { code, data });
                return data;
              }
            })
          });

          console.log('Referral result:', referralResult);
          user.referredBy = referredBy;
        } catch (error) {
          console.error('Referral processing error:', error);
          // Continue with user creation even if referral fails
        }
      }

      await user.save({ session });
      await session.commitTransaction();

      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Create user error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    } finally {
      session.endSession();
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
}

module.exports = UserController;