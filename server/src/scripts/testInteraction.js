const mongoose = require('mongoose');
const Meme = require('../models/Meme');
const User = require('../models/User');
require('dotenv').config({ path: '../../.env' });

async function testInteraction() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // Create a test user if doesn't exist
    let user = await User.findOne({ telegramId: '12345' });
    if (!user) {
      user = await User.create({
        telegramId: '12345',
        username: 'testuser',
        points: 0,
        totalPoints: 0
      });
      console.log('Created test user:', user);
    }

    // Get a test meme
    const meme = await Meme.findOne();
    console.log('\nInitial meme state:', {
      id: meme._id,
      likes: meme.engagement.likes,
      superLikes: meme.engagement.superLikes
    });

    // Test like interaction
    meme.engagement.likes += 1;
    await meme.save();
    
    console.log('\nAfter like:', {
      id: meme._id,
      likes: meme.engagement.likes,
      superLikes: meme.engagement.superLikes
    });

    // Test super like interaction
    meme.engagement.superLikes += 1;
    await meme.save();

    console.log('\nAfter super like:', {
      id: meme._id,
      likes: meme.engagement.likes,
      superLikes: meme.engagement.superLikes
    });

    // Verify the changes persist
    const updatedMeme = await Meme.findById(meme._id);
    console.log('\nVerified final state:', {
      id: updatedMeme._id,
      likes: updatedMeme.engagement.likes,
      superLikes: updatedMeme.engagement.superLikes
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
}

testInteraction();