const mongoose = require('mongoose');
// Import models directly
const Task = require('../models/Task');
const User = require('../models/User');
const PointsTransaction = require('../models/Points'); // Note: Points.js contains PointsTransaction model

class TaskController {
  static TASK_POINTS = 10; // Default points for task completion

  static async createTask(req, res) {
    try {
      const task = new Task(req.body);
      await task.save();
      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async completeTask(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const { taskId, telegramId } = req.body;
      const [task, user] = await Promise.all([
        Task.findById(taskId),
        User.findOne({ telegramId })
      ]);

      if (!task) {
        throw new Error('Task not found');
      }
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user already completed this task
      if (user.completedTasks.some(t => t.taskId.toString() === taskId)) {
        throw new Error('Task already completed');
      }

      // Update user's points and task completion
      user.totalPoints += TaskController.TASK_POINTS;
      user.pointsBreakdown.tasks += TaskController.TASK_POINTS;
      user.completedTasks.push({
        taskId,
        completedAt: new Date()
      });

      // Create points transaction
      const pointsTransaction = new PointsTransaction({
        user: telegramId,
        amount: TaskController.TASK_POINTS,
        type: 'earn',
        source: 'task',
        relatedEntity: {
          entityType: 'task',
          entityId: taskId
        },
        description: `Completed task: ${task.action}`
      });

      // Update task analytics
      task.analytics.completions += 1;
      task.analytics.lastCompletedAt = new Date();
      task.analytics.uniqueUsers += 1;

      // Save all changes
      await Promise.all([
        user.save({ session }),
        task.save({ session }),
        pointsTransaction.save({ session })
      ]);

      await session.commitTransaction();

      res.json({
        success: true,
        data: {
          user: {
            telegramId: user.telegramId,
            totalPoints: user.totalPoints,
            taskPoints: user.pointsBreakdown.tasks
          },
          task: {
            id: task._id,
            completions: task.analytics.completions
          }
        }
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Complete task error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    } finally {
      session.endSession();
    }
  }
}

module.exports = TaskController;