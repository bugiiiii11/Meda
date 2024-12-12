const mongoose = require('mongoose');
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
      console.log('Getting next meme for user:', telegramId);

      // Get user's view history for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const viewedMemes = await ViewHistory.find({
        user: telegramId,
        lastViewed: { $gte: today }
      }).select('memeId');
      
      console.log('User viewed memes today:', viewedMemes.length);

      const viewedMemeIds = viewedMemes.map(vh => vh.memeId);
      
      // Find memes not viewed today, considering weight
      const meme = await Meme.aggregate([
        {
          $match: {
            id: { $nin: viewedMemeIds },
            status: 'active'
          }
        },
        // Use weight for random selection
        { $sample: { size: 1 } }
      ]);

      if (!meme || meme.length === 0) {
        // If no unseen memes, get random meme
        const randomMeme = await Meme.aggregate([
          { $match: { status: 'active' } },
          { $sample: { size: 1 } }
        ]);

        if (!randomMeme || randomMeme.length === 0) {
          return res.json({
            success: false,
            error: 'No memes available'
          });
        }
        meme[0] = randomMeme[0];
      }

      // Format the content and logo paths
      meme[0].content = `/assets/memes/meme${meme[0].id}.png`;
      const logoNumber = meme[0].logo.match(/logo(\d+)/) ? 
                        meme[0].logo.match(/logo(\d+)/)[1] : '1';
      meme[0].logo = `/assets/logos/logo${logoNumber}.png`;

      // Record the view
      await ViewHistory.create({
        user: telegramId,
        memeId: meme[0].id,
        projectName: meme[0].projectName,
        lastViewed: new Date(),
        interactions: [{ type: 'view', timestamp: new Date() }]
      });

      // Add default engagement data if not present
      meme[0].engagement = {
        likes: 0,
        superLikes: 0,
        dislikes: 0,
        ...(meme[0].engagement || {})
      };

      console.log('Returning meme:', {
        id: meme[0].id,
        projectName: meme[0].projectName,
        content: meme[0].content,
        logo: meme[0].logo
      });

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
        }
      ]);

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
}

module.exports = MemeController;