// server/src/routes/interactionRoutes.js
const express = require('express');
const router = express.Router();
const InteractionController = require('../controllers/InteractionController');
const { validateRequest } = require('../middleware/validation');
const { bypassAuthInDevelopment } = require('../middleware/auth');

router.get('/debug', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

router.post('/update',
  bypassAuthInDevelopment,
  validateRequest('handleInteraction'),
  InteractionController.handleInteraction
);

router.get('/leaderboard',
  bypassAuthInDevelopment,
  InteractionController.getLeaderboard  
);

if (process.env.NODE_ENV === 'development') {
  router.get('/debug', (req, res) => res.json({ status: 'ok' }));
}

module.exports = router;