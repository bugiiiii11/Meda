const mongoose = require('mongoose');

const pointsTransactionSchema = new mongoose.Schema({
  user: {
    type: String,  // Changed to String to store telegramId
    ref: 'User',
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['earn', 'spend', 'expire', 'bonus'],
    required: true
  },
  source: {
    type: String,
    enum: ['like', 'dislike', 'superlike', 'task', 'referral', 'daily', 'premium'],
    required: true
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['meme', 'task', 'referral', 'project'],
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.Mixed,  // Can be ObjectId or Number (for memeId)
      required: true
    }
  },
  description: String,
  expiryDate: Date
}, {
  timestamps: true
});

// Indexes for efficient querying
pointsTransactionSchema.index({ user: 1, createdAt: -1 });
pointsTransactionSchema.index({ source: 1, type: 1 });
pointsTransactionSchema.index({ 'relatedEntity.entityType': 1, 'relatedEntity.entityId': 1 });

module.exports = mongoose.model('PointsTransaction', pointsTransactionSchema);