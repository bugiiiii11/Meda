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

  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode - bypassing auth');
    req.telegramUser = {
      id: req.body.telegramId || 'test123',
      username: req.body.username || 'testuser'
    };
    return next();
  }

  const initData = req.headers['x-telegram-init-data'];
  console.log('Production mode - Received init data:', initData);

  // For now, bypass verification in production for testing
  req.telegramUser = {
    id: req.body.telegramId,
    username: req.body.username
  };
  console.log('Setting mock user in production:', req.telegramUser);
  return next();

  // Uncomment the following line and comment out the above bypass
  // when ready to enforce real verification
  // return verifyTelegramWebAppData(req, res, next);
};

module.exports = {
  verifyTelegramWebAppData,
  bypassAuthInDevelopment
};