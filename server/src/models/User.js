// server/src/models/User.js
const mongoose = require('mongoose');

const completedTaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['quick', 'achievement', 'news'],
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  pointsAwarded: {
    type: Number,
    required: true
  },
  achievementTier: {
    type: Number,
    required: function() {
      return this.type === 'achievement';
    }
  }
});

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
  completedTasks: [completedTaskSchema],
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Method to get display name
userSchema.methods.getDisplayName = function() {
  return this.username || `user${this.telegramId.slice(-4)}`;
};

// Method to calculate total points
userSchema.methods.calculateTotalPoints = function() {
  this.totalPoints = (
    this.pointsBreakdown.likes +
    this.pointsBreakdown.dislikes +
    (this.pointsBreakdown.superLikes * 3) +
    this.pointsBreakdown.tasks +
    this.pointsBreakdown.referrals
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

// Method to complete a task
userSchema.methods.completeTask = async function(taskId, type, points, achievementTier = null) {
  const taskData = {
    taskId,
    type,
    completedAt: new Date(),
    pointsAwarded: points
  };

  if (type === 'achievement' && achievementTier) {
    taskData.achievementTier = achievementTier;
  }

  this.completedTasks.push(taskData);
  this.pointsBreakdown.tasks += points;
  this.calculateTotalPoints();
};

// Generate referral code if not exists
userSchema.methods.generateReferralCode = function() {
  if (!this.referralStats.referralCode) {
    this.referralStats.referralCode = `${this.telegramId}_${Math.random().toString(36).substr(2, 6)}`;
  }
  return this.referralStats.referralCode;
};

// Indexes
userSchema.index({ telegramId: 1 }, { unique: true });
userSchema.index({ totalPoints: -1 });
userSchema.index({ 'referralStats.referralCode': 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;