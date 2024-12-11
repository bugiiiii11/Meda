//validation.js
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
    username: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional()
  }),

  // Meme validations
  createMeme: Joi.object({
    id: Joi.number().required(),
    projectName: Joi.string().required(),
    content: Joi.string().required(),
    weight: Joi.number().default(1),
    projectDetails: Joi.object({
      type: Joi.string().valid('Meme', 'Gaming', 'AI').default('Meme'),
      network: Joi.string().required(),
      price: Joi.string().required(),
      marketCap: Joi.number(),
      priceChange24h: Joi.number(),
      contract: Joi.string(),
      website: Joi.string().uri().optional(),
      twitter: Joi.string().optional(),
      telegram: Joi.string().optional()
    })
  }),

  // Task validations
  createTask: Joi.object({
    projectId: Joi.string().required(),
    type: Joi.string().valid('social', 'sponsored', 'daily').required(),
    action: Joi.string().valid('visit', 'join', 'follow', 'share').required(),
    points: Joi.number().min(0).required(),
    requirements: Joi.object({
      link: Joi.string().uri().optional(),
      platform: Joi.string().valid('telegram', 'twitter', 'website', 'other').required(),
      verificationMethod: Joi.string().valid('click', 'manual', 'api').default('click')
    }),
    status: Joi.string().valid('active', 'inactive', 'completed').default('active')
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

  // Leaderboard validations (for query params)
  getLeaderboard: Joi.object({
    type: Joi.string().valid('all', 'users', 'projects').default('all'),
    limit: Joi.number().min(1).max(100).default(50)
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
      abortEarly: false,  // Return all errors, not just the first one
      stripUnknown: true  // Remove unknown fields
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
  schemas  // Export schemas for testing purposes
};