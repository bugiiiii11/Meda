//server/src/controllers/ReferralController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const PointsTransaction = require('../models/Points');

class ReferralController {
  static REFERRAL_POINTS = 20;

  static async redeemReferral(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { referralCode, newUserTelegramId } = req.body;
      console.log('Attempting to redeem referral:', {
        referralCode,
        newUserTelegramId,
        body: req.body
      });

      // Find referrer by their telegram ID (which is now used as referral code)
      const referrer = await User.findOne({ telegramId: referralCode });
      console.log('Referrer found:', referrer);

      if (!referrer) {
        throw new Error('Invalid referral code');
      }

      // Check if new user already exists
      const existingUser = await User.findOne({ telegramId: newUserTelegramId });
      console.log('Existing user check:', existingUser);

      if (existingUser) {
        if (existingUser.referredBy) {
          console.log('User already referred by:', existingUser.referredBy);
          throw new Error('User has already been referred');
        }
        
        // Update existing user with referral info
        existingUser.referredBy = referrer.telegramId;
        await existingUser.save({ session });
        console.log('Updated existing user with referral:', existingUser);
      }

      // Update referrer's points and stats
      referrer.totalPoints += ReferralController.REFERRAL_POINTS;
      referrer.pointsBreakdown.referrals += ReferralController.REFERRAL_POINTS;
      if (!referrer.referralStats) {
        referrer.referralStats = { referredUsers: [] };
      }
      referrer.referralStats.referredUsers.push(newUserTelegramId);
      await referrer.save({ session });
      console.log('Updated referrer stats:', {
        totalPoints: referrer.totalPoints,
        referralPoints: referrer.pointsBreakdown.referrals,
        referredUsers: referrer.referralStats.referredUsers
      });

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
      await pointsTransaction.save({ session });
      console.log('Created points transaction:', pointsTransaction);

      await session.commitTransaction();
      console.log('Referral redemption completed successfully');

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
      console.log('Found user stats:', user);

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