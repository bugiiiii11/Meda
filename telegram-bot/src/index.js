const TelegramBot = require('node-telegram-bot-api');
const { setupHandlers } = require('./handlers');
require('dotenv').config();

async function startBot() {
  try {
    console.log('Starting bot initialization...');
    
    // Validate environment variables
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set in environment variables');
    }

    if (!process.env.WEBAPP_URL) {
      throw new Error('WEBAPP_URL is not set in environment variables');
    }

    console.log('Environment variables validated');
    console.log('WEBAPP_URL:', process.env.WEBAPP_URL);
    
    // Create bot instance with error handling
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { 
      polling: true,
      filepath: false // Disable file downloading
    });

    // Add error handlers
    bot.on('error', (error) => {
      console.error('Bot error:', error.message);
    });

    bot.on('polling_error', (error) => {
      console.error('Polling error:', error.message);
      if (error.code) {
        console.error('Error code:', error.code);
      }
    });

    // Test bot connection
    console.log('Testing bot connection...');
    const botInfo = await bot.getMe();
    console.log('Bot connected successfully:', botInfo);

    // Setup handlers
    console.log('Setting up message handlers...');
    setupHandlers(bot);

    console.log('Bot initialization completed successfully');
    
    // Keep process alive
    process.on('unhandledRejection', (error) => {
      console.error('Unhandled promise rejection:', error);
    });

  } catch (error) {
    console.error('Fatal error during bot initialization:', error);
    process.exit(1);
  }
}

startBot().catch(error => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});