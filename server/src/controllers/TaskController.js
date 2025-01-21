// server/src/controllers/TaskController.js
const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/User');
const PointsTransaction = require('../models/Points');

class TaskController {
  static async completeTask(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { taskId, telegramId } = req.body;

      // Find task and user
      const [task, user] = await Promise.all([
        Task.findOne({ taskId }),
        User.findOne({ telegramId })
      ]);

      if (!task || !user) {
        throw new Error(!task ? 'Task not found' : 'User not found');
      }

      // Check if task is active
      if (task.status !== 'active') {
        throw new Error('This task is not currently active');
      }

      // Handle different task types
      switch (task.type) {
        case 'quick': {
          // Check if already completed
          if (user.completedTasks.some(t => t.taskId === taskId)) {
            throw new Error('Task already completed');
          }
        
          // Award points using the new method
          await user.completeTask(taskId, 'quick', task.points);
        
          // Create points transaction
          await new PointsTransaction({
            user: telegramId,
            amount: task.points,
            type: 'earn',
            source: 'task',
            relatedEntity: {
              entityType: 'task',
              entityId: taskId
            },
            description: `Completed task: ${task.label}`
          }).save({ session });
        
          break;
        }
        
        case 'news': {
          // For news tasks, check if this specific news task was completed
          if (user.completedTasks.some(t => t.taskId === taskId)) {
            throw new Error('This news item already read');
          }
        
          // Award points using the new method
          await user.completeTask(taskId, 'news', task.points);
        
          // Create points transaction
          await new PointsTransaction({
            user: telegramId,
            amount: task.points,
            type: 'earn',
            source: 'task',
            relatedEntity: {
              entityType: 'task',
              entityId: taskId
            },
            description: `Read news: ${task.label}`
          }).save({ session });
        
          break;
        }

        case 'achievement': {
          // Get current value based on category
          const currentValue = task.category === 'referrals' 
            ? user.referralStats.referredUsers.length
            : user.pointsBreakdown[task.category];
        
          // Find the next uncompleted tier
          const completedTiers = user.completedTasks
            .filter(t => t.taskId === taskId)
            .map(t => t.achievementTier);

          const nextTier = task.tiers.find(tier => 
            !completedTiers.includes(tier.level) && 
            currentValue === tier.max  // Our updated condition
          );
        
          if (!nextTier) {
            throw new Error('No achievement tier reached');
          }
        
          // Award points using the achievement method
          const result = await user.completeAchievement(
            task.category,
            nextTier.level,
            nextTier.reward
          );
        
          if (!result.success) {
            throw new Error('Failed to complete achievement');
          }
        
          // Create points transaction
          await new PointsTransaction({
            user: telegramId,
            amount: nextTier.reward,
            type: 'earn',
            source: 'achievement',
            relatedEntity: {
              entityType: 'task',
              entityId: taskId
            },
            description: `Completed ${task.label} - Tier ${nextTier.level}`
          }).save({ session });
        
          break;
        }
      }

      // Save user changes
      await user.save({ session });
      await session.commitTransaction();

      // Return updated user data
      res.json({
        success: true,
        data: {
          taskId,
          type: task.type,
          completedAt: new Date(),
          user: {
            totalPoints: user.totalPoints,
            pointsBreakdown: user.pointsBreakdown,
            completedTasks: user.completedTasks
          }
        }
      });

    } catch (error) {
      await session.abortTransaction();
      console.error('Task completion error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    } finally {
      session.endSession();
    }
  }

  static async checkAchievements(req, res) {
    try {
      const { telegramId } = req.params;
      const user = await User.findOne({ telegramId });
      
      if (!user) {
        throw new Error('User not found');
      }

      const achievements = await Task.find({ type: 'achievement' });
      const progress = {};

      for (const achievement of achievements) {
        const currentValue = achievement.category === 'referrals'
          ? user.referralStats.referredUsers.length
          : user.pointsBreakdown[achievement.category];

        const completedTiers = user.completedTasks
          .filter(t => t.taskId === achievement.taskId)
          .map(t => t.achievementTier);

        const nextTier = achievement.tiers.find(tier => 
          !completedTiers.includes(tier.level) && currentValue < tier.target
        );

        progress[achievement.taskId] = {
          current: currentValue,
          nextTier: nextTier || achievement.tiers[achievement.tiers.length - 1],
          completedTiers
        };
      }

      res.json({
        success: true,
        data: { progress }
      });

    } catch (error) {
      console.error('Check achievements error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getAchievementTiers(req, res) {
    try {
      const achievementTasks = await Task.find({ 
        type: 'achievement',
        status: 'active'
      }).select('taskId type category label tiers');
      
      res.json({
        success: true,
        data: achievementTasks
      });
    } catch (error) {
      console.error('Get achievement tiers error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

}

module.exports = TaskController;