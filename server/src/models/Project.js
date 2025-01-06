// Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  score: {
    total: { type: Number, default: 0, index: -1 }, // For leaderboard sorting
    breakdown: {
      likes: { type: Number, default: 0 },       // +1 per like
      superLikes: { type: Number, default: 0 }   // +3 per super like
    }
  },
  memeStats: [{
    memeId: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    superLikes: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
  }],
  description: { 
    type: String,
    maxLength: 500 // Limiting description length
  },
  projectType: {
    type: String,
    default: 'GameFi'
  },
  type: {
    type: String,
    enum: ['Pre-Sale', 'Gaming Blockchain', 'Strategy', 'Shooter', 'Telegram App', 'Telegram Game', 'MMORPG', 'RPG', 'Game Hub', 'GameFi', 'NFT Game'],
    default: 'NFT Game'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  network: String,
  contractAddress: String,
  social: {
    website: String,
    telegram: String,
    twitter: String
  },
  analytics: {
    totalViews: { type: Number, default: 0 },
    totalLinkClicks: { type: Number, default: 0 },
    totalTaskCompletions: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
projectSchema.index({ 'score.total': -1 });
projectSchema.index({ type: 1, status: 1 });
projectSchema.index({ 'memeStats.memeId': 1 });
projectSchema.index({ network: 1 });

// Method to update total score
projectSchema.methods.updateTotalScore = async function() {
  // Calculate total likes and super likes across all memes
  const totalLikes = this.memeStats.reduce((sum, meme) => sum + meme.likes, 0);
  const totalSuperLikes = this.memeStats.reduce((sum, meme) => sum + meme.superLikes, 0);
  
  // Update score breakdown
  this.score.breakdown.likes = totalLikes;
  this.score.breakdown.superLikes = totalSuperLikes;
  
  // Calculate total score (likes = 1 point, super likes = 3 points)
  this.score.total = totalLikes + (totalSuperLikes * 3);
  
  this.analytics.lastUpdated = new Date();
  return await this.save();
};

// Method to update meme stats
projectSchema.methods.updateMemeStats = async function(memeId, action) {
  let meme = this.memeStats.find(m => m.memeId === memeId);
  
  if (!meme) {
    meme = { memeId, likes: 0, superLikes: 0, views: 0 };
    this.memeStats.push(meme);
  }
  
  if (action === 'like') {
    meme.likes += 1;
  } else if (action === 'superlike') {
    meme.superLikes += 1;
  } else if (action === 'view') {
    meme.views += 1;
  }
  
  await this.updateTotalScore();
  return this;
};

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;