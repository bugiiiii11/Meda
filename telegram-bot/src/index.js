const TelegramBot = require('node-telegram-bot-api');
const { setupHandlers } = require('./handlers');
const { setupCommands } = require('./commands');
require('dotenv').config();

async function startBot() {
  try {
    console.log('Starting bot initialization...');
    
    if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.WEBAPP_URL) {
      throw new Error('Required environment variables are not set');
    }

    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
      filepath: false
    });

    // Enhanced error handlers
    bot.on('error', (error) => {
      console.error('Bot error:', error.message);
    });

    bot.on('polling_error', (error) => {
      console.error('Polling error:', error.message);
    });

    // Initialize bot and setup commands (including menu button)
    const botInfo = await bot.getMe();
    console.log('Bot connected successfully:', botInfo);

    // Setup commands first (this includes the menu button)
    await setupCommands(bot);
    
    // Then setup message handlers
    setupHandlers(bot);

    console.log('Bot initialization completed successfully');

  } catch (error) {
    console.error('Fatal error during bot initialization:', error);
    process.exit(1);
  }
}

startBot().catch(error => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});