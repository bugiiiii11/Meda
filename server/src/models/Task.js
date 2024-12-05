const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['social', 'sponsored', 'daily'],
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: ['visit', 'join', 'follow', 'share'],
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  requirements: {
    link: String,
    platform: {
      type: String,
      enum: ['telegram', 'twitter', 'website', 'other']
    },
    verificationMethod: {
      type: String,
      enum: ['click', 'manual', 'api'],
      default: 'click'
    }
  },
  analytics: {
    completions: { type: Number, default: 0 },
    lastCompletedAt: Date,
    uniqueUsers: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes for efficient querying
taskSchema.index({ type: 1, status: 1 });
taskSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
taskSchema.index({ 'requirements.platform': 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;