//handlers.js
const setupHandlers = (bot) => {
    bot.onText(/\/start(.*)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const firstName = msg.from.first_name;
      // Get referral ID and clean it
      const referralId = match[1].trim();
      
      try {
        // Construct WebApp URL with referral parameter if it exists
        let webAppUrl = process.env.WEBAPP_URL;
        if (referralId) {
          // Remove any potential leading spaces or slashes
          const cleanReferralId = referralId.replace(/^[\s/]+/, '');
          console.log('Processing referral:', {
            newUser: chatId,
            referralId: cleanReferralId
          });
          
          // Add referral parameter to WebApp URL
          if (cleanReferralId) {
            webAppUrl = `${process.env.WEBAPP_URL}?ref=${cleanReferralId}`;
            console.log('WebApp URL with referral:', webAppUrl);
          }
        }
  
        await bot.sendMessage(
          chatId,
          `Welcome to Meda Swipe, ${firstName}! \n\nDiscover your favorite web3 gaming projects!🚀`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🚀 Start App 🚀',
                    web_app: { 
                      url: webAppUrl
                    }
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