const handleWelcomeMessage = async (bot, chatId, firstName, referralId = '') => {
  try {
    // Construct WebApp URL with referral parameter if it exists
    let webAppUrl = process.env.WEBAPP_URL;
    if (referralId) {
      const cleanReferralId = referralId.replace(/^[\s/]+/, '');
      if (cleanReferralId) {
        webAppUrl = `${process.env.WEBAPP_URL}?ref=${cleanReferralId}`;
      }
    }

    // Send welcome message with play button
    await bot.sendMessage(
      chatId,
      `Welcome to Meda Portal, ${firstName}!\n\n` +
  `Discover your favorite Telegram gaming projects by swiping right! 🚀\n\n` +
  `🔥 Coming Soon:\n` +
  `• More Epic Games\n` +
  `• Web3 Gaming Launchpad\n` +
  `• Meda Token Airdrop\n\n` +
  `Ready to level up your gaming journey? Let's go! ⚔️`,
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
    console.error('Error sending welcome message:', error);
    await bot.sendMessage(chatId, 'Sorry, something went wrong. Please try again.');
  }
};

const setupHandlers = (bot) => {
  // Handle /start command
  bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name;
    const referralId = match[1].trim();
    await handleWelcomeMessage(bot, chatId, firstName, referralId);
  });

  // Handle when bot is added to a group or channel
  bot.on('new_chat_members', async (msg) => {
    const botInfo = await bot.getMe();
    const newMembers = msg.new_chat_members;
    
    if (newMembers.some(member => member.id === botInfo.id)) {
      await handleWelcomeMessage(bot, msg.chat.id, 'everyone');
    }
  });

  // Handle direct bot opens (without /start command)
  bot.on('message', async (msg) => {
    if (!msg.text && msg.chat.type === 'private') {
      await handleWelcomeMessage(bot, msg.chat.id, msg.from.first_name);
    }
  });
};

module.exports = { setupHandlers };