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
  achievements: {
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    superLikes: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 }
  },
  referralStats: {
    referralCode: String,
    referredUsers: [String],
    totalReferralPoints: { type: Number, default: 0 }
  },
  completedTasks: [{
    taskId: String,
    type: String,
    completedAt: Date,
    pointsAwarded: Number,
    achievementTier: Number
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  }
}, {
  timestamps: true
});


// Indexes
userSchema.index({ telegramId: 1 }, { unique: true });
userSchema.index({ totalPoints: -1 });
userSchema.index({ 'referralStats.referralCode': 1 });

// a method to get display name
userSchema.methods.getDisplayName = function() {
  return this.username || `user${this.telegramId.slice(-4)}`;
};

// Method to calculate total points
userSchema.methods.calculateTotalPoints = function() {
  this.totalPoints = (
    this.pointsBreakdown.likes +           // 1 point each
    this.pointsBreakdown.dislikes +        // 1 point each
    (this.pointsBreakdown.superLikes * 3) + // 3 points each
    this.pointsBreakdown.tasks +           // From completed tasks (10 each)
    this.pointsBreakdown.referrals         // From referrals (20 each)
  );
  return this.totalPoints;
};

// Method to update points from an interaction
userSchema.methods.addPoints = async function(type, amount) {
  if (type in this.pointsBreakdown) {
    this.pointsBreakdown[type] += amount;
    this.calculateTotalPoints();
    await this.save();
  }
};

// Generate referral code if not exists
userSchema.methods.generateReferralCode = function() {
  if (!this.referralStats.referralCode) {
    this.referralStats.referralCode = `${this.telegramId}_${Math.random().toString(36).substr(2, 6)}`;
  }
  return this.referralStats.referralCode;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
