// server/src/controllers/LeaderboardController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Analytics = require('../models/Analytics');

class LeaderboardController {
 static async getLeaderboard(req, res) {
   try {
     const { type = 'all', limit = 50 } = req.query;
     
     const response = { 
       success: true,
       timestamp: new Date()
     };

     if (type === 'all' || type === 'users') {
       // Get top users by total points
       const users = await User.find()
         .sort('-totalPoints')
         .limit(parseInt(limit))
         .select('telegramId username totalPoints pointsBreakdown');

       response.users = users.map((user, index) => ({
         telegramId: user.telegramId,
         username: user.username || `user${user.telegramId.slice(-4)}`,
         totalPoints: user.totalPoints,
         rank: index + 1,
         statistics: {
           likes: user.pointsBreakdown.likes,
           superLikes: user.pointsBreakdown.superLikes
         }
       }));
     }

     if (type === 'all' || type === 'projects') {
       // Get top projects by total score
       const projects = await Project.find()
         .sort('-score.total')
         .limit(parseInt(limit))
         .select('name score memeStats type');

       response.projects = projects.map((project, index) => ({
         name: project.name,
         totalPoints: project.score.total,
         totalLikes: project.score.breakdown.likes,
         totalSuperLikes: project.score.breakdown.superLikes,
         memeCount: project.memeStats.length,
         rank: index + 1
       }));
     }

     // Store analytics
     const analytics = new Analytics({
       date: new Date(),
       topUsers: response.users?.map(user => ({
         telegramId: user.telegramId,
         username: user.username,
         points: user.totalPoints,
         interactions: user.statistics.likes + user.statistics.superLikes
       })),
       topProjects: response.projects?.map(project => ({
         projectName: project.name,
         likes: project.totalLikes,
         superLikes: project.totalSuperLikes,
         score: project.totalPoints
       }))
     });
     await analytics.save();

     res.json(response);
   } catch (error) {
     console.error('Leaderboard error:', error);
     res.status(500).json({
       success: false,
       error: error.message
     });
   }
 }

 static async getUserRank(req, res) {
   try {
     const { telegramId } = req.params;
     
     // Get user data
     const user = await User.findOne({ telegramId });
     if (!user) {
       return res.status(404).json({
         success: false,
         error: 'User not found'
       });
     }

     // Calculate user's rank
     const rank = await User.countDocuments({
       totalPoints: { $gt: user.totalPoints }
     }) + 1;

     res.json({
       success: true,
       data: {
         telegramId: user.telegramId,
         username: user.username || `user${user.telegramId.slice(-4)}`,
         rank,
         totalPoints: user.totalPoints,
         statistics: {
           likes: user.pointsBreakdown.likes,
           superLikes: user.pointsBreakdown.superLikes
         }
       }
     });
   } catch (error) {
     console.error('Get user rank error:', error);
     res.status(500).json({
       success: false,
       error: error.message
     });
   }
 }
}

module.exports = LeaderboardController;