const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  metrics: {
    activeUsers: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalDislikes: { type: Number, default: 0 },
    totalSuperLikes: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    premiumConversions: { type: Number, default: 0 },
    revenueUSD: { type: Number, default: 0 }
  },
  topProjects: [{
    projectName: String,
    likes: Number,
    superLikes: Number,
    score: Number
  }],
  topMemes: [{
    memeId: Number,
    projectName: String,
    likes: Number,
    superLikes: Number,
    views: Number
  }],
  topUsers: [{
    telegramId: String,
    username: String,
    points: Number,
    interactions: Number
  }]
}, {
  timestamps: true
});

// Indexes
analyticsSchema.index({ date: -1 });
analyticsSchema.index({ 'topProjects.projectName': 1 });
analyticsSchema.index({ 'topMemes.memeId': 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);