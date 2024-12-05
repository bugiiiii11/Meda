//handlers.js
const setupHandlers = (bot) => {
    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name;
        const username = msg.from.username;

        try {
            // Store initial user data
            const userData = {
                telegramId: msg.from.id.toString(),
                username: username || `user${msg.from.id.toString().slice(-4)}`,
                firstName: firstName,
                lastName: msg.from.last_name
            };

            // You could store this in MongoDB here if needed
            
            await bot.sendMessage(chatId, 
                `Welcome to CryptoMeme, ${firstName}! 🚀\n\nDiscover and rate the best crypto memes.`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { 
                                    text: '🚀 Start App',
                                    web_app: { 
                                        url: `${process.env.WEBAPP_URL}?user=${encodeURIComponent(JSON.stringify(userData))}`
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