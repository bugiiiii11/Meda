const express = require('express');
const router = express.Router();
const ReferralController = require('../controllers/ReferralController');
const { validateRequest } = require('../middleware/validation');
const { bypassAuthInDevelopment } = require('../middleware/auth');

// Redeem referral
router.post('/redeem',
  bypassAuthInDevelopment,
  validateRequest('redeemReferral'),
  (req, res) => ReferralController.redeemReferral(req, res)
);

// Get stats
router.get('/:telegramId/stats',
  bypassAuthInDevelopment,
  (req, res) => ReferralController.getReferralStats(req, res)
);

module.exports = router;