//MemeController.js
const mongoose = require('mongoose');
// Import the Meme model directly instead of trying to access it through mongoose.model
const Meme = require('../models/Meme');
const ViewHistory = require('../models/ViewHistory');

class MemeController {
  static async getMemesWithEngagement(req, res) {
    try {
      const memes = await Meme.aggregate([
        { $match: { status: 'active' } },
        {
          $lookup: {
            from: 'viewhistories',
            let: { memeId: '$id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$memeId', '$$memeId'] }
                }
              },
              {
                $group: {
                  _id: '$memeId',
                  likes: {
                    $sum: {
                      $size: {
                        $filter: {
                          input: '$interactions',
                          as: 'interaction',
                          cond: { $eq: ['$$interaction.type', 'like'] }
                        }
                      }
                    }
                  },
                  superLikes: {
                    $sum: {
                      $size: {
                        $filter: {
                          input: '$interactions',
                          as: 'interaction',
                          cond: { $eq: ['$$interaction.type', 'superlike'] }
                        }
                      }
                    }
                  }
                }
              }
            ],
            as: 'viewStats'
          }
        },
        {
          $addFields: {
            engagement: {
              $let: {
                vars: {
                  stats: { $arrayElemAt: ['$viewStats', 0] }
                },
                in: {
                  likes: { $ifNull: ['$$stats.likes', 0] },
                  superLikes: { $ifNull: ['$$stats.superLikes', 0] }
                }
              }
            }
          }
        },
        {
          $project: {
            viewStats: 0
          }
        }
      ]);

      res.json({
        success: true,
        data: memes
      });
    } catch (error) {
      console.error('Get memes error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = MemeController;