// server/src/controllers/MemeController.js
const mongoose = require('mongoose');
const Meme = require('../models/Meme');
const Project = require('../models/Project');
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

  static async getMemesWithEngagement(req, res) {
    try {
      console.log('Fetching memes with engagement...');
      
      // First get all active memes with their basic engagement data
      const memes = await Meme.find({ status: 'active' })
        .select('id projectName content logo weight engagement projectDetails')
        .lean();

      console.log(`Found ${memes.length} active memes`);

      // Get all projects in one query for efficiency
      const projects = await Project.find({})
        .select('name memeStats')
        .lean();

      console.log(`Found ${projects.length} projects`);

      // Create a map for faster project lookup
      const projectMap = new Map(
        projects.map(project => [project.name, project])
      );

      // Combine meme and project data
      const memesWithEngagement = memes.map(meme => {
        const project = projectMap.get(meme.projectName);
        const memeStats = project?.memeStats?.find(ms => ms.memeId === meme.id);

        // Initialize engagement with zeros if not present
        const memeEngagement = meme.engagement || { likes: 0, superLikes: 0, dislikes: 0 };
        const projectEngagement = memeStats || { likes: 0, superLikes: 0 };

        // Combine engagement data, taking the maximum values
        const combinedEngagement = {
          likes: Math.max(memeEngagement.likes || 0, projectEngagement.likes || 0),
          superLikes: Math.max(memeEngagement.superLikes || 0, projectEngagement.superLikes || 0),
          dislikes: memeEngagement.dislikes || 0 // Dislikes only come from meme collection
        };

        console.log(`Meme ${meme.id} engagement:`, {
          memeEngagement,
          projectEngagement,
          combined: combinedEngagement
        });

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
      const meme = await Meme.findOne({
        id: { $nin: viewedMemeIds },
        status: 'active'
      }).lean();

      if (!meme) {
        return res.json({
          success: true,
          message: 'No more memes available'
        });
      }

      // Get project stats
      const project = await Project.findOne({ name: meme.projectName });
      const memeStats = project?.memeStats?.find(ms => ms.memeId === meme.id);

      // Initialize engagement with zeros if not present
      const memeEngagement = meme.engagement || { likes: 0, superLikes: 0, dislikes: 0 };
      const projectEngagement = memeStats || { likes: 0, superLikes: 0 };

      // Combine engagement data
      const combinedEngagement = {
        likes: Math.max(memeEngagement.likes || 0, projectEngagement.likes || 0),
        superLikes: Math.max(memeEngagement.superLikes || 0, projectEngagement.superLikes || 0),
        dislikes: memeEngagement.dislikes || 0
      };

      // Record the view
      await ViewHistory.create({
        user: telegramId,
        memeId: meme.id,
        projectName: meme.projectName,
        interactions: [{ type: 'view', timestamp: new Date() }]
      });

      const memeWithEngagement = {
        ...meme,
        engagement: combinedEngagement
      };

      console.log('Returning meme with engagement:', {
        id: meme.id,
        engagement: combinedEngagement
      });

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
}

module.exports = MemeController;