// server/src/models/Task.js
const mongoose = require('mongoose');

const taskTierSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  }
});

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['quick', 'achievement', 'news'],
    required: true
  },
  category: {
    type: String,
    enum: ['link', 'likes', 'dislikes', 'superLikes', 'referrals'],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: function() {
      return this.type === 'quick' || this.type === 'news';
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  link: {
    type: String,
    required: function() {
      return this.type === 'quick' || this.type === 'news';
    }
  },
  isRepeatable: {
    type: Boolean,
    default: false
  },
  tiers: {
    type: [taskTierSchema],
    required: function() {
      return this.type === 'achievement';
    },
    default: function() {
      return this.type === 'achievement' ? undefined : [];
    }
  },
  expiryDate: {
    type: Date,
    required: function() {
      return this.type === 'news';
    }
  }
}, {
  timestamps: true
});

// Remove points field from achievement tasks before saving
taskSchema.pre('save', function(next) {
  if (this.type === 'achievement') {
    this.points = undefined;
  }
  next();
});

// Indexes
taskSchema.index({ taskId: 1 }, { unique: true });
taskSchema.index({ type: 1, status: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ 'tiers.level': 1 });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;