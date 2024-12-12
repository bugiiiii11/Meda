//server/src/index.js
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/database');
const User = require('./models/User');

// Import routes
const interactionRoutes = require('./routes/interactionRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const memeRoutes = require('./routes/memeRoutes');
const priceRoutes = require('./routes/priceRoutes');
const referralRoutes = require('./routes/referralRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

// MongoDB Connection Monitoring
mongoose.connection.on('connected', async () => {
  console.log('📂 MongoDB Connected Successfully');
  
  // Test database operations
  try {
    // Check existing users
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);
    
    // Test user query
    const testUsers = await User.find().limit(5);
    console.log('Sample users:', testUsers.map(user => ({
      telegramId: user.telegramId,
      username: user.username,
      totalPoints: user.totalPoints
    })));
  } catch (error) {
    console.error('Database test error:', error);
  }
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

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
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV}`);
      
      // Only log local URL in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🌐 API URL: http://localhost:${PORT}`);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('unhandledRejection', (error) => {
  console.error('Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();