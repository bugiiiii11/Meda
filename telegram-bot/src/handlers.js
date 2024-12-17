//handlers.js
const setupHandlers = (bot) => {
    bot.onText(/\/start(.*)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const firstName = msg.from.first_name;
      const referralId = match[1].trim(); // Capture the referral ID from /start command
      
      try {
        // Construct WebApp URL with referral parameter if it exists
        let webAppUrl = process.env.WEBAPP_URL;
        if (referralId) {
          // Add referral parameter to WebApp URL
          webAppUrl += `?ref=${referralId}`;
          console.log(`User ${chatId} started with referral: ${referralId}`);
        }
  
        await bot.sendMessage(chatId,
          `Welcome to Fynder, ${firstName}! 🚀\n\nDiscover and rate the best crypto projects.`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🚀 Start App',
                    web_app: { url: webAppUrl }
                  }
                ]
              ]
            }
          }
        );
      } catch (error) {
        console.error('Error in start command:', error);
        await bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again.');
      }
    });
  };
  
  module.exports = { setupHandlers };