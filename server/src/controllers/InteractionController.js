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
    console.log('Received interaction request:', {
      body: req.body,
      user: req.telegramUser,
      action: req.body.action
    });

    try {
      session = await mongoose.startSession();
      await session.startTransaction();

      const { action, memeId, telegramId } = req.body;
      console.log('Processing interaction:', { action, memeId, telegramId });

      // Validate action
      if (!['like', 'dislike', 'superlike'].includes(action)) {
        throw new Error(`Invalid action: ${action}`);
      }

      // Find meme
      const meme = await Meme.findOne({ id: memeId }).session(session);
      if (!meme) {
        throw new Error(`Meme not found: ${memeId}`);
      }
      console.log('Found meme:', { id: meme.id, projectName: meme.projectName });

      // Check for existing interaction
      const existingView = await ViewHistory.findOne({
        user: telegramId,
        memeId,
        'interactions.type': action
      }).session(session);

      if (existingView) {
        console.log('Found existing interaction:', existingView);
        throw new Error('User has already performed this action on this meme');
      }

      // Get or create user
      let user = await User.findOne({ telegramId }).session(session);
      if (!user) {
        console.log('Creating new user for interaction:', telegramId);
        user = new User({
          telegramId,
          username: req.telegramUser?.username || `user${telegramId.slice(-4)}`,
          totalPoints: 0,
          pointsBreakdown: {
            likes: 0,
            dislikes: 0,
            superLikes: 0
          }
        });
      }

      // Update meme engagement
      console.log('Updating meme engagement:', { 
        before: meme.engagement,
        action: action 
      });

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
      console.log('Updating user points:', {
        before: user.totalPoints,
        adding: points,
        action: action
      });

      user.totalPoints += points;
      if (action === 'superlike') {
        user.pointsBreakdown.superLikes += 1;
      } else if (action === 'like') {
        user.pointsBreakdown.likes += 1;
      } else {
        user.pointsBreakdown.dislikes += 1;
      }

      // Record points transaction
      const pointsTransaction = new PointsTransaction({
        user: telegramId,
        amount: points,
        type: action,
        memeId: memeId,
        timestamp: new Date()
      });
      await pointsTransaction.save({ session });

      // Record the interaction
      const viewHistory = new ViewHistory({
        user: telegramId,
        memeId,
        projectName: meme.projectName,
        interactions: [{
          type: action,
          timestamp: new Date(),
          points: points
        }]
      });

      // Save everything
      console.log('Saving changes...');
      await Promise.all([
        meme.save({ session }),
        user.save({ session }),
        viewHistory.save({ session })
      ]);

      await session.commitTransaction();
      console.log('Transaction committed successfully');

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
          },
          points: points,
          timestamp: new Date()
        }
      });

    } catch (error) {
      console.error('Interaction error:', {
        error: error.message,
        stack: error.stack,
        request: {
          body: req.body,
          user: req.telegramUser
        }
      });

      if (session) {
        try {
          await session.abortTransaction();
          console.log('Transaction aborted');
        } catch (abortError) {
          console.error('Error aborting transaction:', abortError);
        }
      }

      res.status(400).json({
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } finally {
      if (session) {
        try {
          await session.endSession();
        } catch (endError) {
          console.error('Error ending session:', endError);
        }
      }
    }
  }
}

module.exports = InteractionController;