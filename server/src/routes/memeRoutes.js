// routes/memeRoutes.js
const express = require('express');
const router = express.Router();
const MemeController = require('../controllers/MemeController');
const { validateRequest } = require('../middleware/validation');
const { bypassAuthInDevelopment } = require('../middleware/auth');

// Ensure all controller methods exist before adding routes
router.post('/create', bypassAuthInDevelopment, validateRequest('createMeme'), MemeController.createMeme);
router.get('/next/:telegramId', bypassAuthInDevelopment, MemeController.getNextMeme);
router.get('/withEngagement', MemeController.getMemesWithEngagement);

module.exports = router;