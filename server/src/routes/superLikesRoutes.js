const express = require('express');
const router = express.Router();
const { validateRequest } = require('../middleware/validation');
const { bypassAuthInDevelopment } = require('../middleware/auth');
const SuperLikeController = require('../controllers/SuperLikeController');

console.log('Initializing superlike routes');

// Add test route
router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Superlikes router is working' });
});

// Debug middleware
router.use((req, res, next) => {
  console.log(`Superlike route hit: ${req.method} ${req.originalUrl}`);
  next();
});

// Status endpoint - update path
router.get('/status/:telegramId', 
  (req, res, next) => {
    console.log('Status endpoint hit with params:', req.params);
    next();
  },
  bypassAuthInDevelopment,
  SuperLikeController.getSuperlikeStatus
);

// Use superlike endpoint - update path
router.post('/use',
  (req, res, next) => {
    console.log('Use superlike endpoint hit with body:', req.body);
    next();
  },
  bypassAuthInDevelopment,
  validateRequest('useSuperlike'),
  SuperLikeController.useSuperlike
);

module.exports = router;