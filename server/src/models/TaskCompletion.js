// server/src/models/TaskCompletion.js
const mongoose = require('mongoose');

const taskCompletionSchema = new mongoose.Schema({
  userId: {
    type: String,  // Telegram ID
    required: true
  },
  taskId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['quick', 'achievement', 'news'],
    required: true
  },
  achievementTier: {
    type: Number,
    required: function() {
      return this.type === 'achievement';
    }
  },
  pointsAwarded: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes
taskCompletionSchema.index({ userId: 1, taskId: 1 });
taskCompletionSchema.index({ userId: 1, type: 1 });
taskCompletionSchema.index({ taskId: 1, completedAt: -1 });

// Ensure unique completion for non-repeatable tasks
taskCompletionSchema.index(
  { userId: 1, taskId: 1 }, 
  { unique: true, partialFilterExpression: { type: { $in: ['quick', 'achievement'] } } }
);

const TaskCompletion = mongoose.model('TaskCompletion', taskCompletionSchema);

module.exports = TaskCompletion;