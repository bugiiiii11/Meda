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
      
      // Get meme with engagement data
      const meme = await Meme.aggregate([
        {
          $match: { status: 'active' }
        },
        {
          $lookup: {
            from: 'viewhistories',
            let: { memeId: '$id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$memeId', '$$memeId'] },
                      { $eq: ['$user', telegramId] }
                    ]
                  }
                }
              }
            ],
            as: 'viewHistory'
          }
        },
        {
          $match: {
            'viewHistory': { $size: 0 }
          }
        },
        { $sample: { size: 1 } }
      ]);
  
      if (!meme.length) {
        return res.json({
          success: true,
          message: 'No more memes available'
        });
      }
  
      // Record the view
      await ViewHistory.create({
        user: telegramId,
        memeId: meme[0].id,
        projectName: meme[0].projectName,
        interactions: [{ type: 'view', timestamp: new Date() }]
      });
  
      res.json({
        success: true,
        data: {
          ...meme[0],
          engagement: meme[0].engagement || { likes: 0, superLikes: 0, dislikes: 0 }
        }
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