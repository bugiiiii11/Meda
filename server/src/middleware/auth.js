// src/middleware/auth.js
const crypto = require('crypto');

const verifyTelegramWebAppData = (req, res, next) => {
  console.log('Starting Telegram verification process');
  try {
    const initData = req.headers['x-telegram-init-data'];
    console.log('Raw init data:', initData);

    if (!initData) {
      console.log('No init data provided in headers');
      return res.status(401).json({
        success: false,
        error: 'No Telegram Web App data provided'
      });
    }

    // Parse the initData string
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    console.log('Hash from init data:', hash);

    if (!hash) {
      console.log('No hash found in init data');
      return res.status(401).json({
        success: false,
        error: 'No hash provided in Telegram data'
      });
    }

    urlParams.delete('hash');

    // Sort parameters alphabetically
    const paramArray = Array.from(urlParams.entries());
    paramArray.sort((a, b) => a[0].localeCompare(b[0]));
    const dataCheckString = paramArray.map(([key, value]) => `${key}=${value}`).join('\n');

    // Create HMAC-SHA256
    const secretKey = crypto.createHmac('sha256', 'WebAppData')
      .update(process.env.TELEGRAM_BOT_TOKEN)
      .digest();

    const hmac = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    console.log('Verification result:', {
      calculatedHmac: hmac,
      receivedHash: hash,
      matches: hmac === hash
    });

    if (hmac !== hash) {
      console.log('Hash verification failed');
      return res.status(401).json({
        success: false,
        error: 'Invalid Telegram Web App data'
      });
    }

    // Parse user data
    const userData = urlParams.get('user');
    console.log('User data from params:', userData);

    if (!userData) {
      console.log('No user data found in params');
      return res.status(401).json({
        success: false,
        error: 'No user data provided'
      });
    }

    req.telegramUser = JSON.parse(userData);
    console.log('Parsed telegram user:', req.telegramUser);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: 'Authentication failed',
      details: error.message
    });
  }
};

const bypassAuthInDevelopment = (req, res, next) => {
  console.log('Auth middleware - Environment:', process.env.NODE_ENV);
  console.log('Auth middleware - Headers:', req.headers);
  console.log('Auth middleware - Body:', req.body);

  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode - using mock user');
    req.telegramUser = {
      id: req.body.telegramId || 'test123',
      username: req.body.username || 'testuser'
    };
    return next();
  }

  // For production, use the actual Telegram data
  if (!req.body.telegramId) {
    console.error('No telegramId provided in request body');
    return res.status(401).json({
      success: false,
      error: 'No user data provided'
    });
  }

  req.telegramUser = {
    id: req.body.telegramId,
    username: req.body.username
  };
  console.log('Using Telegram user:', req.telegramUser);
  return next();
};

module.exports = {
  verifyTelegramWebAppData,
  bypassAuthInDevelopment
};