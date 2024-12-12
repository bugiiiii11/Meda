//MemeController.js
const mongoose = require('mongoose');
// Import the Meme model directly instead of trying to access it through mongoose.model
const Meme = require('../models/Meme');
const ViewHistory = require('../models/ViewHistory');

class MemeController {
  static async createMeme(req, res) {
    try {
      const meme = new Meme(req.body);
      await meme.save();
      res.status(201).json({
        success: true,
        data: meme
      });
    } catch (error) {
      console.error('Create meme error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getNextMeme(req, res) {
    try {
      const { telegramId } = req.params;
      // Get user's view history for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const viewedMemes = await ViewHistory.find({
        user: telegramId,
        lastViewed: { $gte: today }
      }).select('memeId');

      const viewedMemeIds = viewedMemes.map(vh => vh.memeId);

      // Find memes not viewed today, prioritizing by weight
      const meme = await Meme.findOne({
        id: { $nin: viewedMemeIds },
        status: 'active'
      }).sort({ weight: -1 });

      if (!meme) {
        return res.json({
          success: true,
          message: 'No more memes available'
        });
      }

      // Record the view
      await ViewHistory.create({
        user: telegramId,
        memeId: meme.id,
        projectName: meme.projectName,
        interactions: [{ type: 'view' }]
      });

      res.json({
        success: true,
        data: meme
      });
    } catch (error) {
      console.error('Get next meme error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = MemeController;