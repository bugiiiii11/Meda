// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: String,
  firstName: String,
  lastName: String,
  totalPoints: {
    type: Number,
    default: 0,
    index: -1 // For leaderboard sorting
  },
  pointsBreakdown: {
    likes: { type: Number, default: 0 },         // +1 per like
    dislikes: { type: Number, default: 0 },      // +1 per dislike
    superLikes: { type: Number, default: 0 },    // +3 per super like
    tasks: { type: Number, default: 0 },         // +10 per task
    referrals: { type: Number, default: 0 }      // +20 per referral
  },
  referralStats: {
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    referredBy: {
      type: String,
      ref: 'User',
      index: true
    },
    referredUsers: [{
      type: String,
      ref: 'User'
    }],
    totalReferralPoints: { type: Number, default: 0 }
  },
  completedTasks: [{
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    pointsEarned: { type: Number, default: 0 },
    verified: { type: Boolean, default: false }
  }],
  lastActive: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
userSchema.index({ totalPoints: -1 });
userSchema.index({ 'referralStats.referralCode': 1 }, { sparse: true });
userSchema.index({ 'completedTasks.taskId': 1, 'completedTasks.projectId': 1 });
userSchema.index({ lastActive: -1 });

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
