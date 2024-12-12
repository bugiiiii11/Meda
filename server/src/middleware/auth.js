//src/middleware/auth.js
const crypto = require('crypto');

const verifyTelegramWebAppData = (req, res, next) => {
  try {
    const { initData } = req.headers;
    if (!initData) {
      return res.status(401).json({
        success: false,
        error: 'No Telegram Web App data provided'
      });
    }

    // Parse the initData string
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    // Sort parameters alphabetically
    const paramArray = Array.from(urlParams.entries());
    paramArray.sort((a, b) => a[0].localeCompare(b[0]));

    // Create data check string
    const dataCheckString = paramArray
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create HMAC-SHA256
    const secretKey = crypto.createHmac('sha256', 'WebAppData')
      .update(process.env.TELEGRAM_BOT_TOKEN)
      .digest();

    const hmac = crypto.createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (hmac !== hash) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Telegram Web App data'
      });
    }

    // Add user data to request
    req.telegramUser = JSON.parse(urlParams.get('user'));
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Development bypass middleware
const bypassAuthInDevelopment = (req, res, next) => {
  console.log('Auth middleware - headers:', req.headers);
  console.log('Environment:', process.env.NODE_ENV);
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode - bypassing auth');
    req.telegramUser = {
      id: req.body.telegramId || 'test123',
      username: req.body.username || 'testuser'
    };
    return next();
  }

  const initData = req.headers['x-telegram-init-data'];
  console.log('Received init data:', initData);

  if (!initData) {
    console.log('No init data provided');
    return res.status(401).json({
      success: false,
      error: 'No Telegram Web App data provided'
    });
  }

  // Temporarily bypass verification in production for testing
  console.log('Production mode - temporarily bypassing verification');
  req.telegramUser = {
    id: req.body.telegramId,
    username: req.body.username
  };
  return next();
};

module.exports = {
  verifyTelegramWebAppData,
  bypassAuthInDevelopment
};