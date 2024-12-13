// server/src/controllers/MemeController.js
const mongoose = require('mongoose');
const Meme = require('../models/Meme');
const Project = require('../models/Project'); // Add this import
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

      // Find memes not viewed today
      const memes = await Meme.find({
        id: { $nin: viewedMemeIds },
        status: 'active'
      }).lean();

      if (memes.length === 0) {
        return res.json({
          success: true,
          message: 'No more memes available'
        });
      }

      // Get a random meme
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];

      // Get project stats for the meme
      const project = await Project.findOne({ name: randomMeme.projectName });
      const memeStats = project?.memeStats?.find(ms => ms.memeId === randomMeme.id);

      // Combine meme and project stats
      const memeWithEngagement = {
        ...randomMeme,
        engagement: {
          likes: memeStats?.likes || 0,
          superLikes: memeStats?.superLikes || 0,
          dislikes: randomMeme.engagement?.dislikes || 0
        }
      };

      // Record the view
      await ViewHistory.create({
        user: telegramId,
        memeId: randomMeme.id,
        projectName: randomMeme.projectName,
        interactions: [{ type: 'view', timestamp: new Date() }]
      });

      console.log('Returning meme with engagement:', memeWithEngagement);

      res.json({
        success: true,
        data: memeWithEngagement
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
      console.log('Getting memes with engagement data');
      
      // First get all memes
      const memes = await Meme.find({ status: 'active' })
        .select('id projectName content logo weight engagement projectDetails')
        .lean();
  
      // Then get all projects with their meme stats
      const projects = await Project.find({
        name: { $in: [...new Set(memes.map(m => m.projectName))] }
      }).lean();
  
      // Combine the data
      const memesWithEngagement = memes.map(meme => {
        // Find corresponding project
        const project = projects.find(p => p.name === meme.projectName);
        // Find meme stats in project
        const memeStats = project?.memeStats?.find(ms => ms.memeId === meme.id);
  
        return {
          ...meme,
          engagement: {
            likes: memeStats?.likes || meme.engagement?.likes || 0,
            superLikes: memeStats?.superLikes || meme.engagement?.superLikes || 0,
            dislikes: meme.engagement?.dislikes || 0
          }
        };
      });
  
      console.log('First meme engagement data:', memesWithEngagement[0]?.engagement);
  
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
      
      // Get project data
      const project = await Project.findOne({ name: projectName }).lean();
      
      // Get memes for the project
      const memes = await Meme.find({
        projectName,
        status: 'active'
      }).lean();

      // Combine meme and project data
      const memesWithEngagement = memes.map(meme => {
        const memeStats = project?.memeStats?.find(ms => ms.memeId === meme.id);
        
        return {
          ...meme,
          engagement: {
            likes: memeStats?.likes || 0,
            superLikes: memeStats?.superLikes || 0,
            dislikes: meme.engagement?.dislikes || 0
          }
        };
      });

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