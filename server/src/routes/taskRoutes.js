// server/src/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const { validateRequest } = require('../middleware/validation');
const { bypassAuthInDevelopment } = require('../middleware/auth');

// Complete a task endpoint
router.post('/complete',
  bypassAuthInDevelopment,
  validateRequest('completeTask'),
  TaskController.completeTask
);

// Check achievement progress endpoint
router.get('/:telegramId/achievements',
  bypassAuthInDevelopment,
  TaskController.checkAchievements
);

module.exports = router;