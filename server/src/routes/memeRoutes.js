// memeRoutes.js
const express = require('express');
const router = express.Router();
const MemeController = require('../controllers/MemeController');
const { validateRequest } = require('../middleware/validation');
const { bypassAuthInDevelopment } = require('../middleware/auth');

router.post('/create',
  bypassAuthInDevelopment,
  validateRequest('createMeme'),
  MemeController.createMeme
);

router.get('/next/:telegramId',
  bypassAuthInDevelopment,
  MemeController.getNextMeme
);

module.exports = router;