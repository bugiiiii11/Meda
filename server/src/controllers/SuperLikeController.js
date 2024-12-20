const User = require('../models/User');

class SuperLikeController {
  static async useSuperlike(req, res) {
    try {
      const { telegramId, memeId } = req.body;
      
      const user = await User.findOne({ telegramId });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const success = await user.useSuperlike();
      if (!success) {
        return res.status(400).json({
          success: false,
          error: 'No superlikes remaining'
        });
      }

      // Return updated superlike status
      res.json({
        success: true,
        data: {
          remainingSuperlikes: user.superlikes.limit - user.superlikes.daily.count,
          nextResetIn: Math.ceil(24 - Math.abs(new Date() - user.superlikes.daily.lastReset) / 36e5),
          totalUsedToday: user.superlikes.daily.count
        }
      });
    } catch (error) {
      console.error('Superlike error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getSuperlikeStatus(req, res) {
    try {
      const { telegramId } = req.params;
      
      const user = await User.findOne({ telegramId });
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const canSuperlike = await user.canSuperlike();
      
      res.json({
        success: true,
        data: {
          canSuperlike,
          remainingSuperlikes: user.superlikes.limit - user.superlikes.daily.count,
          nextResetIn: Math.ceil(24 - Math.abs(new Date() - user.superlikes.daily.lastReset) / 36e5),
          totalUsedToday: user.superlikes.daily.count
        }
      });
    } catch (error) {
      console.error('Get superlike status error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = SuperLikeController;