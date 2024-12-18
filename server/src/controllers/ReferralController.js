//server/src/controllers/ReferralController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const PointsTransaction = require('../models/Points');

class ReferralController {
  static async redeemReferral(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { referralCode, newUserTelegramId } = req.body;
      
      // Find referrer by their telegram ID (which is used as referral code)
      const referrer = await User.findOne({ telegramId: referralCode });
      
      if (!referrer) {
        throw new Error('Invalid referral code');
      }

      // Check if new user already exists
      const existingUser = await User.findOne({ telegramId: newUserTelegramId });
      
      if (existingUser) {
        if (existingUser.referredBy) {
          throw new Error('User has already been referred');
        }
        
        // Update existing user with referral info
        existingUser.referredBy = referrer.telegramId;
        await existingUser.save({ session });
      }

      // Update referrer's points and stats
      referrer.totalPoints += 20; // Referral points
      referrer.pointsBreakdown.referrals += 20;
      
      // Initialize referralStats if not exists
      if (!referrer.referralStats) {
        referrer.referralStats = { referredUsers: [] };
      }
      
      referrer.referralStats.referredUsers.push(newUserTelegramId);
      await referrer.save({ session });

      // Create points transaction
      const pointsTransaction = new PointsTransaction({
        user: referrer.telegramId,
        amount: 20,
        type: 'earn',
        source: 'referral',
        relatedEntity: {
          entityType: 'user',
          entityId: newUserTelegramId
        },
        description: `Earned points for referring user ${newUserTelegramId}`
      });

      await pointsTransaction.save({ session });
      await session.commitTransaction();

      res.json({
        success: true,
        data: {
          newUserId: newUserTelegramId,
          referrer: {
            telegramId: referrer.telegramId,
            totalPoints: referrer.totalPoints,
            referralCount: referrer.referralStats.referredUsers.length
          }
        }
      });

    } catch (error) {
      await session.abortTransaction();
      console.error('Referral redemption error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    } finally {
      session.endSession();
    }
  }

  static async getReferralStats(req, res) {
    try {
      const { telegramId } = req.params;
      
      const user = await User.findOne({ telegramId });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          referredUsers: user.referralStats?.referredUsers || [],
          referralPoints: user.pointsBreakdown?.referrals || 0
        }
      });

    } catch (error) {
      console.error('Get referral stats error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = ReferralController;