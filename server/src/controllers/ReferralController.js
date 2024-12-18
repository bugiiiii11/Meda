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
      console.log('Attempting referral redemption:', {
        referralCode,
        newUserTelegramId
      });

      if (!referralCode || !newUserTelegramId) {
        throw new Error('Referral code and new user ID are required');
      }

      // Find referrer (user who shared their link)
      const referrer = await User.findOne({ telegramId: referralCode });
      console.log('Found referrer:', referrer);

      if (!referrer) {
        throw new Error('Invalid referral code');
      }

      // Check if the new user is trying to refer themselves
      if (referralCode === newUserTelegramId) {
        throw new Error('Cannot refer yourself');
      }

      // Find or create the new user
      let newUser = await User.findOne({ telegramId: newUserTelegramId });
      console.log('Found new user:', newUser);

      if (newUser?.referredBy) {
        throw new Error('User has already been referred');
      }

      if (newUser) {
        // Update existing user with referral
        newUser.referredBy = referrer.telegramId;
        await newUser.save({ session });
      }

      // Update referrer's points and stats
      referrer.totalPoints += 20;
      referrer.pointsBreakdown.referrals += 20;

      // Initialize referralStats if needed
      if (!referrer.referralStats) {
        referrer.referralStats = { referredUsers: [] };
      }

      // Add new user to referrer's list if not already there
      if (!referrer.referralStats.referredUsers.includes(newUserTelegramId)) {
        referrer.referralStats.referredUsers.push(newUserTelegramId);
      }

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

      console.log('Referral completed successfully', {
        referrer: referrer.telegramId,
        newUser: newUserTelegramId,
        points: 20
      });

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
      console.log('Getting referral stats for:', telegramId);

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
          referralCode: user.telegramId,
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