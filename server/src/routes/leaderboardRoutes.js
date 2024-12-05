// leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const LeaderboardController = require('../controllers/LeaderboardController');
const { bypassAuthInDevelopment } = require('../middleware/auth');

router.get('/leaderboard', LeaderboardController.getLeaderboard);

router.get('/user/:telegramId', LeaderboardController.getUserRank);

module.exports = router;