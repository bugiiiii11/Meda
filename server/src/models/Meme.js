//Meme.js
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
  logo: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    default: 1
  },
  engagement: {
    likes: { type: Number, default: 0 },
    superLikes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 }
  },
  projectDetails: {
    network: { type: String, required: true },
    price: { type: String, required: true },
    marketCap: { type: String, required: true },
    priceChange24h: { type: Number, required: true },
    contract: { type: String, required: true },
    website: { type: String, required: true },
    priceChart: { type: String },
    buyLink: { type: String, required: true },
    telegramUrl: { type: String },
    twitterUrl: { type: String }
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

// Add method to format content path
memeSchema.methods.getFormattedContent = function() {
  return `/assets/memes/meme${this.id}.png`;
};

// Add method to format logo path
memeSchema.methods.getFormattedLogo = function() {
  // Extract logo number from the stored path or use project-specific logic
  const logoNumber = this.logo.match(/logo(\d+)/)[1];
  return `/assets/logos/logo${logoNumber}.png`;
};

// Indexes for efficient querying
memeSchema.index({ 'engagement.likes': -1 });
memeSchema.index({ 'engagement.superLikes': -1 });
memeSchema.index({ status: 1 });
memeSchema.index({ weight: 1 });

const Meme = mongoose.model('Meme', memeSchema);

module.exports = Meme;