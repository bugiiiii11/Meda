// server/scripts/seedFromDummy.js
const mongoose = require('mongoose');
const Meme = require('../src/models/Meme');
const Project = require('../src/models/Project');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dummyMemes = [
    
  {
    id: 1,
    projectName: "Pixels",
    content: "/assets/memes/game1.png",
    weight: 3,
    logo: "/assets/logos/logo_pixels.png",
    projectDetails: {
      network: "Ronin",
      price: "0.1794",
      marketCap: "137000000",
      priceChange24h: -1,
      contract: "0x7eae20d11ef8c779433eb24503def900b9d28ad7",
      buyLink: "https://www.binance.com/en/trade/PIXEL_USDT?ref=37754157",
      sector: "Gaming", 
      buttons: [
        {
          label: "Website",
          url: "pixels.xyz"
        },
        {
          label: "Price Chart",
          url: "https://www.binance.com/en/trade/PIXEL_USDT?ref=37754157"
        },
        {
          label: "Join Discord",
          url: "https://discord.com/invite/pixels"
        },
        {
          label: "Twitter",
          url: "https://x.com/pixels_online"
        }
      ]
    }
  },
  {
    id: 2,
    projectName: "Gala",
    content: "/assets/memes/game2.png",
    weight: 2,
    logo: "/assets/logos/logo_gala.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.0383",
      marketCap: "1600000000",
      priceChange24h: -1,
      contract: "0xd1d2eb1b1e90b638588728b4130137d262c87cae",
      buyLink: "https://www.binance.com/en/trade/GALA_USDT?ref=37754157&type=spot",
      sector: "Gaming", 
      buttons: [
        {
          label: "Website",
          url: "https://gala.com/"
        },
        {
          label: "Price Chart",
          url: "https://www.binance.com/en/trade/GALA_USDT?ref=37754157&type=spot"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/PoweredByGala"
        },
        {
          label: "Twitter",
          url: "https://x.com/GoGalaGames"
        }
      ]
    }
  },
  
  ];

  async function seedFromDummy() {
    try {
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected successfully!');
  
      // Clear existing data
      console.log('Clearing existing data...');
      await Promise.all([
        Meme.deleteMany({}),
        Project.deleteMany({})
      ]);
  
      // Insert memes with proper structure
      console.log('Inserting memes...');
      const insertedMemes = await Meme.insertMany(dummyMemes.map(meme => ({
        ...meme,
        _id: new mongoose.Types.ObjectId(),
        id: meme.id,
        engagement: {
          likes: 0,
          superLikes: 0,
          dislikes: 0
        }
      })));
  
      // Create projects from unique projectNames
      console.log('Creating projects...');
      const uniqueProjects = [...new Set(dummyMemes.map(meme => meme.projectName))];
      const projectPromises = uniqueProjects.map(projectName => {
        const projectMemes = dummyMemes.filter(meme => meme.projectName === projectName);
        const firstMeme = projectMemes[0];
      
        // Find specific social links from buttons array
        const websiteButton = firstMeme.projectDetails.buttons.find(b => b.label === "Website");
        const twitterButton = firstMeme.projectDetails.buttons.find(b => b.label === "Twitter");
        const telegramButton = firstMeme.projectDetails.buttons.find(b => b.label === "Join Telegram");

        return Project.create({
          name: projectName,
          type: firstMeme.projectDetails.sector || 'Meme',
          status: 'active',
          network: firstMeme.projectDetails.network,
          contractAddress: firstMeme.projectDetails.contract,
          social: {
            website: websiteButton?.url || '',
            telegram: telegramButton?.url || '',
            twitter: twitterButton?.url || ''
          },
          score: {
            total: 0,
            breakdown: {
              likes: 0,
              superLikes: 0
            }
          },
          memeStats: projectMemes.map(meme => ({
            memeId: meme.id,
            likes: 0,
            superLikes: 0,
            views: 0
          }))
        });
      });
  
      await Promise.all(projectPromises);
  
      // Add verification logging
      console.log('Verifying inserted data...');
      const totalMemes = await Meme.countDocuments();
      const totalProjects = await Project.countDocuments();
      const sampleMeme = await Meme.findOne();
      const sampleProject = await Project.findOne();
  
      console.log(`Total memes in database: ${totalMemes}`);
      console.log(`Total projects in database: ${totalProjects}`);
      console.log('Sample meme:', sampleMeme);
      console.log('Sample project:', sampleProject);
  
      console.log(`Successfully seeded ${totalMemes} memes and ${totalProjects} projects`);
  
    } catch (error) {
      console.error('Error seeding database:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
    }
  }
  
  seedFromDummy();