// validation.js
const Joi = require('joi');

const schemas = {
  // Interaction validations
  handleInteraction: Joi.object({
    action: Joi.string().valid('like', 'dislike', 'superlike').required(),
    memeId: Joi.number().required(),
    telegramId: Joi.string().required(),
    username: Joi.string().optional()
  }),

  // User validations
  createUser: Joi.object({
    telegramId: Joi.string().required(),
    username: Joi.string().allow('', null).optional(),
    firstName: Joi.string().allow('', null).optional(),
    lastName: Joi.string().allow('', null).optional(),
    referredBy: Joi.string().allow('', null).optional()
  }),

  // Meme validations
  createMeme: Joi.object({
    id: Joi.number().required(),
    projectName: Joi.string().required(),
    content: Joi.string().required(),
    weight: Joi.number().default(1),
    projectDetails: Joi.object({
      type: Joi.string().valid('GameFi', 'Play', 'Gaming Blockchain', 'NFT Game', 'Game Hub', 'Telegram Game Hub', 'Telegram App', 'Telegram Game').default('Telegram Game'),
      network: Joi.string().required(),
      price: Joi.string().required(),
      marketCap: Joi.number(),
      priceChange24h: Joi.number(),
      contract: Joi.string(),
      description: Joi.string().max(500), // Added description validation
      projectType: Joi.string(), // Added projectType validation
      sector: Joi.string(),
      sectorUrl: Joi.string().uri(), // Added sectorUrl validation
      website: Joi.string().uri().optional(),
      twitter: Joi.string().optional(),
      telegram: Joi.string().optional()
    })
  }),

  // Updated Task validations
  createTask: Joi.object({
    taskId: Joi.string().required(),
    type: Joi.string().valid('quick', 'achievement', 'news').required(),
    category: Joi.string().valid('link', 'likes', 'dislikes', 'superLikes', 'referrals').required(),
    label: Joi.string().required(),
    status: Joi.string().valid('active', 'inactive').default('active'),
    // Conditional fields based on type
    points: Joi.when('type', {
      is: Joi.string().valid('quick', 'news'),
      then: Joi.number().required(),
      otherwise: Joi.forbidden()
    }),
    link: Joi.when('type', {
      is: Joi.string().valid('quick', 'news'),
      then: Joi.string().uri().required(),
      otherwise: Joi.forbidden()
    }),
    isRepeatable: Joi.boolean().default(false),
    tiers: Joi.when('type', {
      is: 'achievement',
      then: Joi.array().items(
        Joi.object({
          level: Joi.number().required(),
          target: Joi.number().required(),
          points: Joi.number().required()
        })
      ).required(),
      otherwise: Joi.forbidden()
    }),
    expiryDate: Joi.when('type', {
      is: 'news',
      then: Joi.date().required(),
      otherwise: Joi.forbidden()
    })
  }),

  completeTask: Joi.object({
    taskId: Joi.string().required(),
    telegramId: Joi.string().required()
  }),

  // Referral validations
  createReferral: Joi.object({
    telegramId: Joi.string().required()
  }),

  redeemReferral: Joi.object({
    referralCode: Joi.string().required(),
    newUserTelegramId: Joi.string().required(),
    username: Joi.string().optional()
  }),

  // Leaderboard validations
  getLeaderboard: Joi.object({
    type: Joi.string().valid('all', 'users', 'projects').default('all'),
    limit: Joi.number().min(1).max(100).default(50)
  }),

  // Superlikes validations
  useSuperlike: Joi.object({
    telegramId: Joi.string().required(),
    memeId: Joi.number().required()
  })
};

const validateRequest = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(500).json({
        success: false,
        error: 'Validation schema not found'
      });
    }

    // Determine what to validate based on request method
    let validationTarget = req.body;
    if (req.method === 'GET') {
      validationTarget = req.query;
    }

    const { error } = schema.validate(validationTarget, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details.map(detail => detail.message).join(', ')
      });
    }

    next();
  };
};

module.exports = {
  validateRequest,
  schemas // Export schemas for testing purposes
};