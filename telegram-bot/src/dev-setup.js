const ngrok = require('ngrok');
const fs = require('fs');
const path = require('path');

async function setupDevEnvironment() {
    try {
        // Start ngrok tunnel
        const url = await ngrok.connect({
            addr: 3000, // React app port
            proto: 'http'
        });

        console.log('\nSetup URLs:');
        console.log('Local React App:', 'http://localhost:3000');
        console.log('Ngrok URL:', url);
        console.log('Local API Server:', 'http://localhost:3001');

        // Create handlers.js with the ngrok URL
        const handlersPath = path.join(__dirname, 'handlers.js');
        const handlersContent = `
const setupHandlers = (bot) => {
    bot.onText(/\\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name;

        try {
            await bot.sendMessage(chatId, 
                \`Welcome to CryptoMeme, \${firstName}! 🚀\n\nDiscover and rate the best crypto memes.\`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { 
                                    text: '🚀 Start App',
                                    web_app: { url: '${url}' }
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
`;
        fs.writeFileSync(handlersPath, handlersContent);
        console.log('\nHandlers updated with ngrok URL');

    } catch (error) {
        console.error('Error setting up development environment:', error);
        process.exit(1);
    }
}

setupDevEnvironment();