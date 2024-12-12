const mongoose = require('mongoose');
const Meme = require('../models/Meme');
const ViewHistory = require('../models/ViewHistory');

class MemeController {
  static async getNextMeme(req, res) {
    try {
      const { telegramId } = req.params;
      console.log('Getting next meme for user:', telegramId);

      // Debug: Count total available memes
      const totalMemes = await Meme.countDocuments({ status: 'active' });
      console.log('Total active memes in database:', totalMemes);

      if (totalMemes === 0) {
        console.log('No memes available in database');
        return res.json({
          success: false,
          error: 'No memes available in database'
        });
      }

      // Get user's view history for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const viewedMemes = await ViewHistory.find({
        user: telegramId,
        lastViewed: { $gte: today }
      }).select('memeId');
      
      console.log('User viewed memes today:', viewedMemes.length);

      const viewedMemeIds = viewedMemes.map(vh => vh.memeId);
      
      // Find memes not viewed today
      let meme = await Meme.findOne({
        id: { $nin: viewedMemeIds },
        status: 'active'
      }).lean();

      if (!meme) {
        console.log('No new memes available for user');
        // If user has seen all memes today, reset and show random meme
        meme = await Meme.findOne({ status: 'active' }).lean();
        if (!meme) {
          return res.json({
            success: false,
            error: 'No memes available'
          });
        }
      }

      console.log('Selected meme:', meme.id);

      // Record the view
      await ViewHistory.create({
        user: telegramId,
        memeId: meme.id,
        projectName: meme.projectName,
        lastViewed: new Date(),
        interactions: [{ type: 'view', timestamp: new Date() }]
      });

      // Add default engagement data if not present
      meme.engagement = {
        likes: 0,
        superLikes: 0,
        dislikes: 0,
        ...(meme.engagement || {})
      };

      console.log('Returning meme with engagement:', {
        id: meme.id,
        projectName: meme.projectName,
        engagement: meme.engagement
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

  static async createMeme(req, res) {
    try {
      console.log('Creating new meme:', req.body);
      
      // Validate required fields
      const requiredFields = ['id', 'projectName', 'content'];
      for (const field of requiredFields) {
        if (!req.body[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Add default values
      const memeData = {
        ...req.body,
        status: 'active',
        engagement: {
          likes: 0,
          superLikes: 0,
          dislikes: 0
        },
        createdAt: new Date()
      };

      const meme = new Meme(memeData);
      await meme.save();

      console.log('Created meme:', meme.id);

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

  static async getMemesWithEngagement(req, res) {
    try {
      console.log('Getting memes with engagement data');
      const memes = await Meme.find({ status: 'active' }).lean();
      
      const memesWithEngagement = memes.map(meme => ({
        ...meme,
        engagement: {
          likes: 0,
          superLikes: 0,
          dislikes: 0,
          ...(meme.engagement || {})
        }
      }));

      console.log(`Found ${memesWithEngagement.length} memes with engagement data`);
      res.json({
        success: true,
        data: memesWithEngagement
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
      const memes = await Meme.find({
        projectName,
        status: 'active'
      }).lean();

      const memesWithEngagement = memes.map(meme => ({
        ...meme,
        engagement: {
          likes: 0,
          superLikes: 0,
          dislikes: 0,
          ...(meme.engagement || {})
        }
      }));

      res.json({
        success: true,
        data: memesWithEngagement
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