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
  timestamps: true
});

// Indexes for efficient querying
memeSchema.index({ 'engagement.likes': -1 });
memeSchema.index({ 'engagement.superLikes': -1 });
memeSchema.index({ 'projectDetails.type': 1, 'projectDetails.network': 1 });
memeSchema.index({ status: 1 });

const Meme = mongoose.model('Meme', memeSchema);

module.exports = Meme;