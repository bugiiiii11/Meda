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
      // Get memes and projects
      const memes = await Meme.find({ status: 'active' }).lean();
      console.log('Sample raw meme:', JSON.stringify(memes[0], null, 2));
  
      const projects = await Project.find().lean();
      console.log('Sample project:', JSON.stringify(projects[0], null, 2));
  
      // Combine data
      const memesWithEngagement = memes.map(meme => {
        const project = projects.find(p => p.name === meme.projectName);
        const memeStats = project?.memeStats?.find(ms => ms.memeId === meme.id);
        
        const combinedEngagement = {
          likes: memeStats?.likes || meme.engagement?.likes || 0,
          superLikes: memeStats?.superLikes || meme.engagement?.superLikes || 0,
          dislikes: meme.engagement?.dislikes || 0
        };
  
        console.log(`Engagement for meme ${meme.id}:`, combinedEngagement);
  
        return {
          ...meme,
          engagement: combinedEngagement
        };
      });
  
      res.json({
        success: true,
        data: memesWithEngagement
      });
    } catch (error) {
      console.error('Get memes with engagement error:', error);
      res.status(500).json({ success: false, error: error.message });
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