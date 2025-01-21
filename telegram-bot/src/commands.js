const setupCommands = async (bot) => {
  const commands = [
    { command: 'start', description: 'Start the bot' }
  ];

  try {
    await bot.setMyCommands(commands);

    // Set bot menu button to show play button
    await bot.setChatMenuButton({
      menuButton: {
        type: 'web_app',
        text: 'Play',
        web_app: {
          url: process.env.WEBAPP_URL
        }
      }
    });

    console.log('Bot commands and menu button configured successfully');
  } catch (error) {
    console.error('Error setting bot commands:', error);
  }
};

module.exports = { setupCommands };