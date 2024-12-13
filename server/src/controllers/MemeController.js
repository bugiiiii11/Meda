// server/src/controllers/MemeController.js
const mongoose = require('mongoose');
const Meme = require('../models/Meme');
const ViewHistory = require('../models/ViewHistory');

class MemeController {
  static async createMeme(req, res) {
    try {
      console.log('Creating new meme:', req.body);
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
      console.log('Getting next meme for user:', telegramId);

      // Get user's view history for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const viewedMemes = await ViewHistory.find({
        user: telegramId,
        lastViewed: { $gte: today }
      }).select('memeId');

      const viewedMemeIds = viewedMemes.map(vh => vh.memeId);

      // Find memes not viewed today with engagement data
      const meme = await Meme.aggregate([
        {
          $match: {
            id: { $nin: viewedMemeIds },
            status: 'active'
          }
        },
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

      console.log('Returning meme with engagement:', meme[0]);

      res.json({
        success: true,
        data: meme[0]
      });
    } catch (error) {
      console.error('Get next meme error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getMemesWithEngagement(req, res) {
    try {
      const sampleMeme = await Meme.findOne().lean();
      console.log('Sample meme data:', sampleMeme);
      
      console.log('Getting memes with engagement data');
      const memes = await Meme.aggregate([
        {
          $match: { status: 'active' }
        },
        {
          $project: {
            id: 1,
            projectName: 1,
            content: 1,
            logo: 1,
            weight: 1,
            engagement: 1,  // Make sure engagement is included
            projectDetails: 1
          }
        }
      ]);
  
      console.log(`Found ${memes.length} memes with engagement data`);
      res.json({
        success: true,
        data: memes
      });
    } catch (error) {
      console.error('Get memes with engagement error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async updateMemeStatus(req, res) {
    try {
      const { memeId, status } = req.body;
      
      const meme = await Meme.findOneAndUpdate(
        { id: memeId },
        { status },
        { new: true }
      );

      if (!meme) {
        return res.status(404).json({
          success: false,
          error: 'Meme not found'
        });
      }

      res.json({
        success: true,
        data: meme
      });
    } catch (error) {
      console.error('Update meme status error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getMemesByProject(req, res) {
    try {
      const { projectName } = req.params;
      const memes = await Meme.aggregate([
        {
          $match: {
            projectName,
            status: 'active'
          }
        },
        {
          $project: {
            id: 1,
            projectName: 1,
            content: 1,
            logo: 1,
            weight: 1,
            engagement: 1,  // Make sure engagement is included
            projectDetails: 1
          }
        }
      ]);
  
      res.json({
        success: true,
        data: memes
      });
    } catch (error) {
      console.error('Get memes by project error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = MemeController;