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
    console.log('Starting interaction with data:', {
      body: req.body,
      headers: req.headers
    });

    session = await mongoose.startSession();
    session.startTransaction();

    const { action, memeId, telegramId } = req.body;
    
    // Find meme with detailed logging
    console.log('Looking for meme:', { memeId });
    const meme = await Meme.findOne({ id: memeId }).session(session);
    console.log('Found meme:', {
      found: !!meme,
      engagement: meme?.engagement,
      projectName: meme?.projectName
    });

    if (!meme) {
      throw new Error('Meme not found');
    }

    // Ensure engagement object exists
    meme.engagement = meme.engagement || { likes: 0, superLikes: 0, dislikes: 0 };
    console.log('Before update - Meme engagement:', meme.engagement);

    // Update engagement counts
    if (action === 'like') {
      meme.engagement.likes += 1;
    } else if (action === 'superlike') {
      meme.engagement.superLikes += 1;
    } else if (action === 'dislike') {
      meme.engagement.dislikes += 1;
    }

    console.log('After update - Meme engagement:', meme.engagement);

    // Update project stats with logging
    if (action !== 'dislike') {
      console.log('Looking for project:', { projectName: meme.projectName });
      const project = await Project.findOne({ name: meme.projectName }).session(session);
      console.log('Found project:', {
        found: !!project,
        memeStats: project?.memeStats
      });
      
      if (project) {
        await project.updateMemeStats(memeId, action);
        console.log('Updated project stats:', {
          projectName: project.name,
          memeStats: project.memeStats
        });
      }
    }

    // Save meme with updated engagement
    await meme.save({ session });

    // Update user points with logging
    console.log('Looking for user:', { telegramId });
    const user = await User.findOne({ telegramId }).session(session);
    console.log('Found user:', {
      found: !!user,
      pointsBreakdown: user?.pointsBreakdown,
      totalPoints: user?.totalPoints
    });

    if (!user) {
      throw new Error('User not found');
    }

    const points = InteractionController.POINTS[action];
    user.pointsBreakdown[action === 'superlike' ? 'superLikes' : action === 'like' ? 'likes' : 'dislikes'] += 1;
    user.totalPoints += points;
    
    console.log('Updated user stats:', {
      pointsBreakdown: user.pointsBreakdown,
      totalPoints: user.totalPoints
    });

    await user.save({ session });
    await session.commitTransaction();
    console.log('Transaction committed successfully');

    // Return updated engagement data
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
    console.error('Interaction error:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    
    if (session) {
      await session.abortTransaction();
      console.log('Transaction aborted');
    }
    
    res.status(400).json({
      success: false,
      error: error.message
    });
  } finally {
    if (session) {
      session.endSession();
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