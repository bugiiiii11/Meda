const express = require('express');
const router = express.Router();
const MemeController = require('../controllers/MemeController');
const { validateRequest } = require('../middleware/validation');
const { bypassAuthInDevelopment } = require('../middleware/auth');

// Create new meme
router.post('/create', 
  bypassAuthInDevelopment, 
  validateRequest('createMeme'), 
  MemeController.createMeme
);

// Get next meme for user
router.get('/next/:telegramId', 
  bypassAuthInDevelopment, 
  MemeController.getNextMeme
);

// Get all memes with engagement
router.get('/withEngagement', 
  MemeController.getMemesWithEngagement
);

// Update meme status
router.post('/status',
  bypassAuthInDevelopment,
  validateRequest('updateMemeStatus'),
  MemeController.updateMemeStatus
);

// Get memes by project
router.get('/project/:projectName',
  bypassAuthInDevelopment,
  MemeController.getMemesByProject
);

module.exports = router;