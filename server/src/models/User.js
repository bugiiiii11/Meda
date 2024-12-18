// server/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  username: String,
  firstName: String,
  lastName: String,
  totalPoints: {
    type: Number,
    default: 0
  },
  pointsBreakdown: {
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    superLikes: { type: Number, default: 0 },
    tasks: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 }
  },
  // Add referredBy field
  referredBy: {
    type: String,
    ref: 'User',
    default: null
  },
  // Update referralStats structure
  referralStats: {
    referredUsers: {
      type: [String],
      default: []
    },
    totalReferralPoints: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Update or create user with referral
userSchema.statics.createOrUpdateWithReferral = async function(userData) {
  const { telegramId, username, firstName, lastName, referredBy } = userData;

  try {
    let user = await this.findOne({ telegramId });
    
    if (user) {
      // Update existing user
      user.username = username || user.username;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      
      // Only set referral if it doesn't exist
      if (referredBy && !user.referredBy) {
        user.referredBy = referredBy;
        
        // Update referrer's stats
        const referrer = await this.findOne({ telegramId: referredBy });
        if (referrer) {
          referrer.totalPoints += 20;
          referrer.pointsBreakdown.referrals += 20;
          if (!referrer.referralStats.referredUsers.includes(telegramId)) {
            referrer.referralStats.referredUsers.push(telegramId);
          }
          await referrer.save();
        }
      }
    } else {
      // Create new user
      user = new this({
        telegramId,
        username,
        firstName,
        lastName,
        referredBy,
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

    await user.save();
    return user;
  } catch (error) {
    console.error('Error in createOrUpdateWithReferral:', error);
    throw error;
  }
};

// Indexes
userSchema.index({ telegramId: 1 }, { unique: true });
userSchema.index({ totalPoints: -1 });
userSchema.index({ 'referralStats.referredUsers': 1 });
userSchema.index({ referredBy: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;