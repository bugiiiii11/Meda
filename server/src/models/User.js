//User.js
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
  // SuperLike limit feature
  superlikes: {
    daily: {
      count: { type: Number, default: 0 },
      lastReset: { type: Date, default: Date.now }
    },
    limit: { type: Number, default: 3 }
  },
  pointsBreakdown: {
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    superLikes: { type: Number, default: 0 },
    tasks: { type: Number, default: 0 },
    referrals: { type: Number, default: 0 },
    achievements: { type: Number, default: 0 } 
  },
  achievements: {
    likes: { 
      points: { type: Number, default: 0 },
      currentTier: { type: Number, default: 0 }
    },
    dislikes: { 
      points: { type: Number, default: 0 },
      currentTier: { type: Number, default: 0 }
    },
    superLikes: { 
      points: { type: Number, default: 0 },
      currentTier: { type: Number, default: 0 }
    },
    referrals: { 
      points: { type: Number, default: 0 },
      currentTier: { type: Number, default: 0 }
    }
  },
  // Add referredBy field to track who referred this user
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
  completedTasks: [completedTaskSchema],
  status: {
    type: String,
    enum: ['active', 'inactive', 'banned'],
    default: 'active'
  }
}, {
  timestamps: true
});

// SuperLike methods
const superlikeMethods = {
  canSuperlike: async function() {
    const now = new Date();
    const lastReset = this.superlikes.daily.lastReset;
    const hoursSinceReset = Math.abs(now - lastReset) / 36e5;

    if (hoursSinceReset >= 24) {
      this.superlikes.daily.count = 0;
      this.superlikes.daily.lastReset = now;
      await this.save();
      return true;
    }

    return this.superlikes.daily.count < this.superlikes.limit;
  },

  useSuperlike: async function() {
    const canUse = await this.canSuperlike();
    if (canUse) {
      this.superlikes.daily.count += 1;
      await this.save();
      return true;
    }
    return false;
  }
};

userSchema.methods = {
  ...userSchema.methods,
  ...superlikeMethods
};

// Method to get display name
userSchema.methods.getDisplayName = function() {
  return this.username || `user${this.telegramId.slice(-4)}`;
};

// Method to calculate total points
userSchema.methods.calculateTotalPoints = function() {
  const achievementsTotal = Object.values(this.achievements)
    .reduce((sum, achievement) => sum + (achievement.points || 0), 0);

  this.totalPoints = (
    this.pointsBreakdown.likes +
    this.pointsBreakdown.dislikes +
    (this.pointsBreakdown.superLikes * 3) +
    this.pointsBreakdown.tasks +
    this.pointsBreakdown.referrals +
    achievementsTotal  // Use the calculated achievements total
  );
  
  // Make sure pointsBreakdown.achievements matches the actual total
  this.pointsBreakdown.achievements = achievementsTotal;
  
  return this.totalPoints;
};

// Add new method to handle achievement completion
userSchema.methods.completeAchievement = async function(category, tier, points) {
  // Update achievements tracking
  if (!this.achievements[category]) {
    this.achievements[category] = {
      points: 0,
      currentTier: 0
    };
  }

  // Only update if this is a new tier
  if (tier > this.achievements[category].currentTier) {
    // Update achievement-specific tracking
    this.achievements[category].currentTier = tier;
    this.achievements[category].points += points;
    
    // Add points to both achievements total and overall total
    this.pointsBreakdown.achievements += points;
    this.totalPoints += points;
    
    // Add to completed tasks
    this.completedTasks.push({
      taskId: `achievement-${category}-${tier}`,
      type: 'achievement',
      completedAt: new Date(),
      pointsAwarded: points,
      achievementTier: tier
    });

    await this.save();
    return {
      success: true,
      points: points,
      newTotalPoints: this.totalPoints
    };
  }
  return {
    success: false,
    reason: 'Tier already completed'
  };
};

// Method to update points from an interaction
userSchema.methods.addPoints = async function(type, amount) {
  if (type in this.pointsBreakdown) {
    this.pointsBreakdown[type] += amount;
    this.calculateTotalPoints();
    await this.save();
  }
};

// Update completeTask method to handle achievements
userSchema.methods.completeTask = async function(taskId, type, points, achievementTier = null) {
  const taskData = {
    taskId,
    type,
    completedAt: new Date(),
    pointsAwarded: points
  };

  if (type === 'achievement' && achievementTier) {
    taskData.achievementTier = achievementTier;
    // For achievement tasks, add points to achievements breakdown
    this.pointsBreakdown.achievements += points;
  } else {
    // For regular tasks
    this.pointsBreakdown.tasks += points;
  }

  this.completedTasks.push(taskData);
  this.calculateTotalPoints();
};

// Method to add a referral
userSchema.methods.addReferral = async function(referredUserId) {
  if (!this.referralStats.referredUsers.includes(referredUserId)) {
    this.referralStats.referredUsers.push(referredUserId);
    this.pointsBreakdown.referrals += 20; // Referral points
    this.referralStats.totalReferralPoints += 20;
    this.calculateTotalPoints();
    await this.save();
    return true;
  }
  return false;
};

// Static method to handle referral process
userSchema.statics.handleReferral = async function(referrerId, newUserId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [referrer, newUser] = await Promise.all([
      this.findOne({ telegramId: referrerId }),
      this.findOne({ telegramId: newUserId })
    ]);

    if (!referrer) {
      throw new Error('Referrer not found');
    }

    if (newUser?.referredBy) {
      throw new Error('User has already been referred');
    }

    // Update referrer
    await referrer.addReferral(newUserId);

    // Update new user
    if (newUser) {
      newUser.referredBy = referrerId;
      await newUser.save({ session });
    }

    await session.commitTransaction();
    return { referrer, newUser };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Indexes
userSchema.index({ telegramId: 1 }, { unique: true });
userSchema.index({ totalPoints: -1 });
userSchema.index({ referredBy: 1 });
userSchema.index({ 'referralStats.referredUsers': 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;
