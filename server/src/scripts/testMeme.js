const mongoose = require('mongoose');
const Meme = require('../models/Meme');
require('dotenv').config({ path: '../../.env' });

async function testSingleMeme() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // Clear existing memes
    await Meme.deleteMany({});
    console.log('Cleared existing memes');

    // Test with a single meme
    const testMeme = {
      projectName: "Test Meme",
      content: "/assets/memes/meme1.png",
      contentType: 'image/png',
      logo: "/assets/logos/logo1.png",
      projectDetails: {
        network: "Solana",
        marketCap: 1000000000,
        price: 1.0,
        priceChange24h: -1,
        contract: "test123",
        website: "https://example.com",
        buyLink: "https://example.com/buy",
        socialLinks: {
          telegram: "https://t.me/test",
          twitter: "https://x.com/test",
          website: "https://example.com"
        }
      },
      displaySettings: {
        weight: 1,
        isPaid: false,
        priority: 0
      },
      engagement: {
        likes: 0,
        dislikes: 0,
        superLikes: 0,
        views: 0,
        clickThroughs: 0
      },
      status: 'active'
    };

    const insertedMeme = await Meme.create(testMeme);
    console.log('\nSuccessfully inserted test meme:', JSON.stringify(insertedMeme, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
}

testSingleMeme();