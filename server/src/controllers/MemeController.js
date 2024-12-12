const mongoose = require('mongoose');
const Meme = require('../models/Meme');
const ViewHistory = require('../models/ViewHistory');

class MemeController {
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