const mongoose = require('mongoose');
const User = require('../models/User');
const Meme = require('../models/Meme');
const PointsTransaction = require('../models/Points');

const checkDatabase = async () => {
  try {
    // Check connection status
    const dbState = mongoose.connection.readyState;
    console.log('MongoDB connection state:', 
      dbState === 0 ? 'Disconnected' :
      dbState === 1 ? 'Connected' :
      dbState === 2 ? 'Connecting' :
      'Unknown'
    );

    // Count documents in collections
    const userCount = await User.countDocuments();
    const memeCount = await Meme.countDocuments();
    const pointsCount = await PointsTransaction.countDocuments();

    console.log('Database stats:', {
      users: userCount,
      memes: memeCount,
      points: pointsCount
    });

    // Get sample documents
    const sampleMeme = await Meme.findOne();
    const sampleUser = await User.findOne();

    console.log('Sample meme:', sampleMeme);
    console.log('Sample user:', sampleUser);

    return {
      status: 'connected',
      stats: {
        users: userCount,
        memes: memeCount,
        points: pointsCount
      },
      samples: {
        meme: sampleMeme,
        user: sampleUser
      }
    };
  } catch (error) {
    console.error('Database check error:', error);
    return {
      status: 'error',
      error: error.message
    };
  }
};

module.exports = checkDatabase;