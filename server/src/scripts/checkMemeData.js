const mongoose = require('mongoose');
const Meme = require('../models/Meme');
const User = require('../models/User');
require('dotenv').config({ path: '../../.env' });

async function checkData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // Check existing memes
    const memeCount = await Meme.countDocuments();
    console.log(`Found ${memeCount} memes in database`);

    if (memeCount > 0) {
      // Show sample meme
      const sampleMeme = await Meme.findOne();
      console.log('Sample meme data:', JSON.stringify(sampleMeme, null, 2));
    }

    // Check existing users
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users in database`);

    if (userCount > 0) {
      // Show sample user
      const sampleUser = await User.findOne();
      console.log('Sample user data:', JSON.stringify(sampleUser, null, 2));
    }

    // Check engagement data
    const memesWithEngagement = await Meme.find({
      $or: [
        { 'engagement.likes': { $gt: 0 } },
        { 'engagement.superLikes': { $gt: 0 } }
      ]
    });
    console.log(`Found ${memesWithEngagement.length} memes with engagement`);

    // Show stats for each meme with engagement
    if (memesWithEngagement.length > 0) {
      console.log('\nEngagement stats:');
      memesWithEngagement.forEach(meme => {
        console.log(`\nMeme: ${meme.projectName}`);
        console.log(`Likes: ${meme.engagement?.likes || 0}`);
        console.log(`Super Likes: ${meme.engagement?.superLikes || 0}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed');
  }
}

checkData();