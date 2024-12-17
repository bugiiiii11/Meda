//handlers.js
const setupHandlers = (bot) => {
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name;

        try {
            await bot.sendMessage(chatId, 
                `Welcome to Fynder, ${firstName}! 🚀\n\nDiscover and rate the best crypto projects.`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { 
                                    text: '🚀 Start App',
                                    web_app: { url: process.env.WEBAPP_URL }
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