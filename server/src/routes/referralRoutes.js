const express = require('express');
const router = express.Router();
const ReferralController = require('../controllers/ReferralController');
const { validateRequest } = require('../middleware/validation');
const { bypassAuthInDevelopment } = require('../middleware/auth');

// Create referral code
router.post('/create',
  bypassAuthInDevelopment,
  validateRequest('createReferral'),
  (req, res) => ReferralController.redeemReferral(req, res)
);

// Stats endpoint
router.get('/:telegramId/stats',
  bypassAuthInDevelopment,
  (req, res) => ReferralController.getReferralStats(req, res)
);

module.exports = router;