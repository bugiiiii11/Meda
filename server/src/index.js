//server/src/index.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

// Import routes
const interactionRoutes = require('./routes/interactionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const memeRoutes = require('./routes/memeRoutes');
const priceRoutes = require('./routes/priceRoutes');
const referralRoutes = require('./routes/referralRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api/interactions', interactionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/memes', memeRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`
🚀 Server is running on port ${PORT}
📱 Environment: ${process.env.NODE_ENV}
📂 MongoDB: Connected
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();