// taskRoutes.js
const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const { validateRequest } = require('../middleware/validation');
const { bypassAuthInDevelopment } = require('../middleware/auth');

router.post('/create',
  bypassAuthInDevelopment,
  validateRequest('createTask'),
  TaskController.createTask
);

router.post('/complete',
  bypassAuthInDevelopment,
  validateRequest('completeTask'),
  TaskController.completeTask
);

module.exports = router;