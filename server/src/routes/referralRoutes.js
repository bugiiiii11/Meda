
// referralRoutes.js
const express = require('express');
const router = express.Router();
const ReferralController = require('../controllers/ReferralController');
const { validateRequest } = require('../middleware/validation');
const { bypassAuthInDevelopment } = require('../middleware/auth');

router.post('/create',
  bypassAuthInDevelopment,
  validateRequest('createReferral'),
  ReferralController.createReferralCode
);

router.post('/redeem',
  bypassAuthInDevelopment,
  validateRequest('redeemReferral'),
  ReferralController.redeemReferral
);

router.get('/:telegramId/stats',
  bypassAuthInDevelopment,
  ReferralController.getReferralStats
);

module.exports = router;