const rateLimit = require('express-rate-limit');

// Create a rate limiter that allows 100 requests per minute
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.'
  }
});

// More strict limiter for auth-related routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many auth attempts. Please try again later.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};