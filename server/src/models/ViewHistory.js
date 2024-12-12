//server/src/models/ViewHistory.js
const mongoose = require('mongoose');

const viewHistorySchema = new mongoose.Schema({
  user: {
    type: String,  // Changed to String to store telegramId
    ref: 'User',
    required: true,
    index: true
  },
  memeId: {
    type: Number,
    required: true,
    index: true
  },
  projectName: {
    type: String,
    required: true,
    index: true
  },
  interactions: [{
    type: {
      type: String,
      enum: ['view', 'like', 'dislike', 'superlike', 'details'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastViewed: {
    type: Date,
    default: Date.now
  },
  viewCount: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Compound indexes for efficient querying
viewHistorySchema.index({ user: 1, memeId: 1 });
viewHistorySchema.index({ projectName: 1, lastViewed: -1 });
viewHistorySchema.index({ user: 1, lastViewed: -1 });
viewHistorySchema.index({ user: 1, projectName: 1, lastViewed: -1 });

module.exports = mongoose.model('ViewHistory', viewHistorySchema);