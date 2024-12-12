//server/src/models/Meme.js
const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  projectName: {
    type: String,
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true
  },
  engagement: {
    likes: { type: Number, default: 0 },
    superLikes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
  },
  weight: {
    type: Number,
    default: 1
  },
  projectDetails: {
    type: { 
      type: String, 
      enum: ['Meme', 'Gaming', 'AI'],
      default: 'Meme'
    },
    network: String,
    price: String,
    marketCap: Number,
    priceChange24h: Number,
    contract: String,
    website: String,
    twitter: String,
    telegram: String
  },
  analytics: {
    linkClicks: {
      website: { type: Number, default: 0 },
      telegram: { type: Number, default: 0 },
      twitter: { type: Number, default: 0 }
    },
    taskCompletions: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    lastViewed: { type: Date, default: Date.now }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add method to update engagement
memeSchema.methods.updateEngagement = async function(action) {
  if (action === 'like') {
    this.engagement.likes += 1;
  } else if (action === 'superlike') {
    this.engagement.superLikes += 1;
  } else if (action === 'dislike') {
    this.engagement.dislikes += 1;
  }
  return this.save();
};

// Indexes for efficient querying
memeSchema.index({ 'engagement.likes': -1 });
memeSchema.index({ 'engagement.superLikes': -1 });
memeSchema.index({ 'projectDetails.type': 1, 'projectDetails.network': 1 });
memeSchema.index({ status: 1 });

const Meme = mongoose.model('Meme', memeSchema);

module.exports = Meme;