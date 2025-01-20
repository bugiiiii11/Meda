// userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { validateRequest } = require('../middleware/validation');
const { bypassAuthInDevelopment } = require('../middleware/auth');

router.post('/create',
  bypassAuthInDevelopment,
  validateRequest('createUser'),
  UserController.createUser
);

router.get('/:telegramId',
  bypassAuthInDevelopment,
  UserController.getUser
);

router.get('/:telegramId/stats',
  bypassAuthInDevelopment,
  UserController.getUserStats
);

router.get('/whitelist/:telegramId', UserController.checkWhitelist);

module.exports = router;