require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const Meme = require('../models/Meme');

async function testMemes() {
  try {
    // List all memes in database
    const memes = await Meme.find({});
    console.log('\nMemes in database:', memes.length);
    
    for (const meme of memes) {
      console.log(`\nMeme ${meme.id}:`);
      console.log('- Project:', meme.projectName);
      console.log('- Content path:', meme.content);
      console.log('- Logo path:', meme.logo);
      console.log('- Status:', meme.status);
      console.log('- Engagement:', meme.engagement);
    }

    // Check if files exist in public folder
    const publicPath = path.join(__dirname, '../client/public');
    
    for (const meme of memes) {
      const contentPath = path.join(publicPath, meme.content);
      const logoPath = path.join(publicPath, meme.logo);
      
      try {
        await fs.access(contentPath);
        console.log(`\n✅ Meme file exists: ${meme.content}`);
      } catch (err) {
        console.log(`\n❌ Meme file missing: ${meme.content}`);
      }
      
      try {
        await fs.access(logoPath);
        console.log(`✅ Logo file exists: ${meme.logo}`);
      } catch (err) {
        console.log(`❌ Logo file missing: ${meme.logo}`);
      }
    }

  } catch (error) {
    console.error('Error testing memes:', error);
  } finally {
    mongoose.disconnect();
  }
}

testMemes();