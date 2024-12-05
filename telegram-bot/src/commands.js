// src/commands.js
const setupCommands = async (bot) => {
    const commands = [
      { command: 'start', description: 'Start the bot' },
      { command: 'menu', description: 'Show main menu' },
      { command: 'profile', description: 'View your profile' },
      { command: 'tasks', description: 'View available tasks' }
    ];
  
    try {
      await bot.setMyCommands(commands);
      console.log('Bot commands set successfully');
    } catch (error) {
      console.error('Error setting bot commands:', error);
    }
  };
  
  module.exports = { setupCommands };