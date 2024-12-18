//server/src/controllers/ReferralController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const PointsTransaction = require('../models/Points');

class ReferralController {
  static REFERRAL_POINTS = 20;

  static async createReferralCode(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { telegramId } = req.body;

      let user = await User.findOne({ telegramId });
      if (!user) {
        throw new Error('User not found');
      }

      // Generate referral code based on telegramId
      if (!user.referralCode) {
        user.referralCode = `${telegramId}_${Math.random().toString(36).substring(7)}`;
        await user.save({ session });
      }

      await session.commitTransaction();

      res.json({
        success: true,
        data: {
          referralCode: user.referralCode
        }
      });

    } catch (error) {
      await session.abortTransaction();
      console.error('Create referral code error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    } finally {
      session.endSession();
    }
  }

  static async redeemReferral(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { referralCode, newUserTelegramId } = req.body;

      // Find referrer
      const referrer = await User.findOne({ referralCode });
      if (!referrer) {
        throw new Error('Invalid referral code');
      }

      // Check if new user already exists
      const existingUser = await User.findOne({ telegramId: newUserTelegramId });
      if (existingUser) {
        throw new Error('User has already joined');
      }

      // Create new user
      const newUser = new User({
        telegramId: newUserTelegramId,
        username: req.body.username,
        referredBy: referrer.telegramId,
        totalPoints: 0,
        pointsBreakdown: {
          likes: 0,
          dislikes: 0,
          superLikes: 0,
          tasks: 0,
          referrals: 0
        }
      });

      // Update referrer's points and referred users
      referrer.totalPoints += ReferralController.REFERRAL_POINTS;
      referrer.pointsBreakdown.referrals += ReferralController.REFERRAL_POINTS;
      referrer.referredUsers.push(newUserTelegramId);

      // Create points transaction for referrer
      const pointsTransaction = new PointsTransaction({
        user: referrer.telegramId,
        amount: ReferralController.REFERRAL_POINTS,
        type: 'earn',
        source: 'referral',
        relatedEntity: {
          entityType: 'user',
          entityId: newUserTelegramId
        },
        description: `Earned points for referring user ${newUserTelegramId}`
      });

      // Save all changes
      await Promise.all([
        newUser.save({ session }),
        referrer.save({ session }),
        pointsTransaction.save({ session })
      ]);

      await session.commitTransaction();

      res.json({
        success: true,
        data: {
          newUser: {
            telegramId: newUser.telegramId,
            username: newUser.username
          },
          referrer: {
            telegramId: referrer.telegramId,
            totalPoints: referrer.totalPoints,
            referralCount: referrer.referredUsers.length
          }
        }
      });

    } catch (error) {
      await session.abortTransaction();
      console.error('Redeem referral error:', error);
      res.status(500).json({
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

      const user = await User.findOne({ telegramId })
        .select('referralCode referredUsers pointsBreakdown.referrals');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      res.json({
        success: true,
        data: {
          referralCode: user.referralCode,
          referralCount: user.referredUsers.length,
          referralPoints: user.pointsBreakdown.referrals
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