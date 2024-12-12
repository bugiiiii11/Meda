// server/src/controllers/InteractionController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Meme = require('../models/Meme');
const Project = require('../models/Project');
const PointsTransaction = require('../models/Points');
const ViewHistory = require('../models/ViewHistory');

class InteractionController {
 static POINTS = {
   like: 1,
   dislike: 1,
   superlike: 3
 };

 static async handleInteraction(req, res) {
  let session;
  try {
    session = await mongoose.startSession();
    await session.startTransaction();

    const { action, memeId, telegramId } = req.body;

    // Validate action
    if (!['like', 'dislike', 'superlike'].includes(action)) {
      throw new Error('Invalid action');
    }

    // Find meme first
    const meme = await Meme.findOne({ id: memeId }).session(session);
    if (!meme) {
      throw new Error('Meme not found');
    }

    // Check for existing interaction
    const existingView = await ViewHistory.findOne({
      user: telegramId,
      memeId,
      'interactions.type': action
    }).session(session);

    if (existingView) {
      throw new Error('User has already performed this action on this meme');
    }

    // Get or create user
    let user = await User.findOne({ telegramId }).session(session);
    if (!user) {
      user = new User({
        telegramId,
        username: `user${telegramId.slice(-4)}`,
        totalPoints: 0,
        pointsBreakdown: {
          likes: 0,
          dislikes: 0,
          superLikes: 0
        }
      });
    }

    // Update meme engagement
    meme.engagement = meme.engagement || { likes: 0, superLikes: 0, dislikes: 0 };
    if (action === 'like') {
      meme.engagement.likes += 1;
    } else if (action === 'superlike') {
      meme.engagement.superLikes += 1;
    } else {
      meme.engagement.dislikes += 1;
    }

    // Update user points
    const points = InteractionController.POINTS[action];
    user.totalPoints += points;
    user.pointsBreakdown[action === 'superlike' ? 'superLikes' : 'likes'] += 1;

    // Record the interaction
    const viewHistory = new ViewHistory({
      user: telegramId,
      memeId,
      projectName: meme.projectName,
      interactions: [{
        type: action,
        timestamp: new Date()
      }]
    });

    // Save everything
    await Promise.all([
      meme.save(),
      user.save(),
      viewHistory.save()
    ]);

    await session.commitTransaction();

    res.json({
      success: true,
      data: {
        meme: {
          id: meme.id,
          engagement: meme.engagement
        },
        user: {
          telegramId: user.telegramId,
          totalPoints: user.totalPoints,
          pointsBreakdown: user.pointsBreakdown
        }
      }
    });

  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    console.error('Interaction error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}

static async getLeaderboard(req, res) {
  try {
    // Get top users
    const users = await User.find()
      .sort('-totalPoints')
      .limit(50)
      .select('telegramId username totalPoints pointsBreakdown');

    // Get projects with their stats
    const projects = await Meme.aggregate([
      {
        $group: {
          _id: '$projectName',
          totalLikes: { $sum: '$engagement.likes' },
          totalSuperLikes: { $sum: '$engagement.superLikes' },
          memeCount: { $sum: 1 }
        }
      },
      {
        $addFields: {
          totalPoints: {
            $add: ['$totalLikes', { $multiply: ['$totalSuperLikes', 3] }]
          }
        }
      },
      {
        $sort: { totalPoints: -1 }
      },
      {
        $limit: 50
      },
      {
        $project: {
          name: '$_id',
          totalPoints: 1,
          totalLikes: 1,
          totalSuperLikes: 1,
          memeCount: 1,
          _id: 0
        }
      }
    ]);

    // Format response
    const response = {
      success: true,
      users: users.map(user => ({
        telegramId: user.telegramId,
        username: user.username || `user${user.telegramId.slice(-4)}`,
        totalPoints: user.totalPoints || 0,
        statistics: {
          likes: user.pointsBreakdown?.likes || 0,
          superLikes: user.pointsBreakdown?.superLikes || 0
        }
      })),
      projects: projects.map(project => ({
        name: project.name,
        totalPoints: project.totalPoints || 0,
        totalLikes: project.totalLikes || 0,
        totalSuperLikes: project.totalSuperLikes || 0,
        memeCount: project.memeCount || 0
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
}

module.exports = InteractionController;