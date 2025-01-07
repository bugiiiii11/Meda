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
    weight: 10,
    logo: "/assets/logos/logo_pixels.png",
    projectDetails: {
      network: "Ronin",
      price: "0.1794",
      marketCap: "137000000",
      priceChange24h: -1,
      contract: "0x7eae20d11ef8c779433eb24503def900b9d28ad7",
      buyLink: "https://www.binance.com/en/trade/PIXEL_USDT?ref=37754157",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://t.me/cryptomeda/",
      projectType: "GameFi",
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
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://games.gala.com/",
      projectType: "Game Hub",
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
  {
    id: 3,
    projectName: "Immutable",
    content: "/assets/memes/game3.png",
    weight: 1,
    logo: "/assets/logos/logo_immutable.png",
    projectDetails: {
      network: "Ethereum",
      price: "1.38",
      marketCap: "2.3B",
      priceChange24h: -1,
      contract: "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
      buyLink: "https://www.binance.com/en/trade/IMX_USDT?ref=37754157&type=spot",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://play.immutable.com/games/",
      projectType: "Gaming Blockchain",
      buttons: [
        {
          label: "Website",
          url: "https://imx.community/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0xfd76be67fff3bac84e3d5444167bbc018f5968b6"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/immutablex"
        },
        {
          label: "Twitter",
          url: "https://x.com/Immutable"
        }
      ]
    }
  },
  {
    id: 4,
    projectName: "Immutable",
    content: "/assets/memes/game4.png",
    weight: 1,
    logo: "/assets/logos/logo_immutable.png",
    projectDetails: {
      network: "Ethereum",
      price: "1.38",
      marketCap: "2.3B",
      priceChange24h: -1,
      contract: "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
      buyLink: "https://www.binance.com/en/trade/IMX_USDT?ref=37754157&type=spot",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://play.immutable.com/games/",
      projectType: "Gaming Blockchain",
      buttons: [
        {
          label: "Website",
          url: "https://imx.community/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0xfd76be67fff3bac84e3d5444167bbc018f5968b6"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/immutablex"
        },
        {
          label: "Twitter",
          url: "https://x.com/Immutable"
        }
      ]
    }
  },
  {
    id: 5,
    projectName: "Immutable",
    content: "/assets/memes/game5.png",
    weight: 1,
    logo: "/assets/logos/logo_immutable.png",
    projectDetails: {
      network: "Ethereum",
      price: "1.38",
      marketCap: "2.3B",
      priceChange24h: -1,
      contract: "0xf57e7e7c23978c3caec3c3548e3d615c346e79ff",
      buyLink: "https://www.binance.com/en/trade/IMX_USDT?ref=37754157&type=spot",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://play.immutable.com/games/",
      projectType: "Gaming Blockchain",
      buttons: [
        {
          label: "Website",
          url: "https://imx.community/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0xfd76be67fff3bac84e3d5444167bbc018f5968b6"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/immutablex"
        },
        {
          label: "Twitter",
          url: "https://x.com/Immutable"
        }
      ]
    }
  },
  {
    id: 6,
    projectName: "Axie Infinity",
    content: "/assets/memes/game6.png",
    weight: 1,
    logo: "/assets/logos/logo_axie.png",
    projectDetails: {
      network: "Ronin",
      price: "6.55",
      marketCap: "1.0B",
      priceChange24h: -1,
      contract: "0x97a9107c1793bc407d6f527b77e7fff4d812bece",
      buyLink: "https://www.binance.com/en/trade/AXS_USDT?ref=37754157",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://welcome.skymavis.com/download/",
      projectType: "Gaming Blockchain",
      buttons: [
        {
          label: "Website",
          url: "https://axieinfinity.com/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/ronin/pools/0x32d1dbb6a4275133cc49f1c61653be3998ada4ff"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/axieinfinity"
        },
        {
          label: "Twitter",
          url: "https://x.com/axieinfinity"
        }
      ]
    }
  },
  {
    id: 7,
    projectName: "Axie Infinity",
    content: "/assets/memes/game7.png",
    weight: 1,
    logo: "/assets/logos/logo_axie.png",
    projectDetails: {
      network: "Ronin",
      price: "6.55",
      marketCap: "1.0B",
      priceChange24h: -1,
      contract: "0x97a9107c1793bc407d6f527b77e7fff4d812bece",
      buyLink: "https://www.binance.com/en/trade/AXS_USDT?ref=37754157",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://welcome.skymavis.com/download/",
      projectType: "Gaming Blockchain",
      buttons: [
        {
          label: "Website",
          url: "https://axieinfinity.com/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/ronin/pools/0x32d1dbb6a4275133cc49f1c61653be3998ada4ff"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/axieinfinity"
        },
        {
          label: "Twitter",
          url: "https://x.com/axieinfinity"
        }
      ]
    }
  },
  {
    id: 8,
    projectName: "SuperVerse",
    content: "/assets/memes/game8.png",
    weight: 1,
    logo: "/assets/logos/logo_super.png",
    projectDetails: {
      network: "Ethereum",
      price: "1.47",
      marketCap: "1.4B",
      priceChange24h: -1,
      contract: "0xe53ec727dbdeb9e2d5456c3be40cff031ab40a55",
      buyLink: "https://www.binance.com/en/trade/SUPER_USDT?ref=37754157&type=spot",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play",  
      sectorUrl: "https://superverse.co/integrations",
      projectType: "Gaming Blockchain",
      buttons: [
        {
          label: "Website",
          url: "https://superverse.co/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0x25647e01bd0967c1b9599fa3521939871d1d0888"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/SuperVerseDAO"
        },
        {
          label: "Twitter",
          url: "https://x.com/SuperVerse"
        }
      ]
    }
  },
  {
    id: 9,
    projectName: "SuperVerse",
    content: "/assets/memes/game9.png",
    weight: 1,
    logo: "/assets/logos/logo_super.png",
    projectDetails: {
      network: "Ethereum",
      price: "1.47",
      marketCap: "1.4B",
      priceChange24h: -1,
      contract: "0xe53ec727dbdeb9e2d5456c3be40cff031ab40a55",
      buyLink: "https://www.binance.com/en/trade/SUPER_USDT?ref=37754157&type=spot",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://superverse.co/integrations",
      projectType: "Gaming Blockchain",
      buttons: [
        {
          label: "Website",
          url: "https://superverse.co/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0x25647e01bd0967c1b9599fa3521939871d1d0888"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/SuperVerseDAO"
        },
        {
          label: "Twitter",
          url: "https://x.com/SuperVerse"
        }
      ]
    }
  },
  {
    id: 10,
    projectName: "SuperVerse",
    content: "/assets/memes/game10.png",
    weight: 1,
    logo: "/assets/logos/logo_super.png",
    projectDetails: {
      network: "Ethereum",
      price: "1.47",
      marketCap: "1.4B",
      priceChange24h: -1,
      contract: "0xe53ec727dbdeb9e2d5456c3be40cff031ab40a55",
      buyLink: "https://www.binance.com/en/trade/SUPER_USDT?ref=37754157&type=spot",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://superverse.co/integrations",
      projectType: "Gaming Blockchain",
      buttons: [
        {
          label: "Website",
          url: "https://superverse.co/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0x25647e01bd0967c1b9599fa3521939871d1d0888"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/SuperVerseDAO"
        },
        {
          label: "Twitter",
          url: "https://x.com/SuperVerse"
        }
      ]
    }
  },
  {
    id: 11,
    projectName: "Illuvium",
    content: "/assets/memes/game11.png",
    weight: 1,
    logo: "/assets/logos/logo_illuvium.png",
    projectDetails: {
      network: "Ethereum",
      price: "39.23",
      marketCap: "0.23B",
      priceChange24h: -1,
      contract: "0x767fe9edc9e0df98e07454847909b5e959d7ca0e",
      buyLink: "https://www.binance.com/en/trade/ILV_USDT?ref=37754157&type=spot",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://store.epicgames.com/en-US/p/illuvium-60064c",
      projectType: "GameFi",
      buttons: [
        {
          label: "Website",
          url: "https://illuvium.io/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0x6a091a3406e0073c3cd6340122143009adac0eda"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/illuvium"
        },
        {
          label: "Twitter",
          url: "https://x.com/illuviumio"
        }
      ]
    }
  },
  {
    id: 12,
    projectName: "Illuvium",
    content: "/assets/memes/game12.png",
    weight: 1,
    logo: "/assets/logos/logo_illuvium.png",
    projectDetails: {
      network: "Ethereum",
      price: "39.23",
      marketCap: "0.23B",
      priceChange24h: -1,
      contract: "0x767fe9edc9e0df98e07454847909b5e959d7ca0e",
      buyLink: "https://www.binance.com/en/trade/ILV_USDT?ref=37754157&type=spot",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://store.epicgames.com/en-US/p/illuvium-60064c",
      projectType: "GameFi",
      buttons: [
        {
          label: "Website",
          url: "https://illuvium.io/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0x6a091a3406e0073c3cd6340122143009adac0eda"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/illuvium"
        },
        {
          label: "Twitter",
          url: "https://x.com/illuviumio"
        }
      ]
    }
  },
  {
    id: 13,
    projectName: "Illuvium",
    content: "/assets/memes/game13.png",
    weight: 1,
    logo: "/assets/logos/logo_illuvium.png",
    projectDetails: {
      network: "Ethereum",
      price: "39.23",
      marketCap: "0.23B",
      priceChange24h: -1,
      contract: "0x767fe9edc9e0df98e07454847909b5e959d7ca0e",
      buyLink: "https://www.binance.com/en/trade/ILV_USDT?ref=37754157&type=spot",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://store.epicgames.com/en-US/p/illuvium-60064c",
      projectType: "GameFi",
      buttons: [
        {
          label: "Website",
          url: "https://illuvium.io/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0x6a091a3406e0073c3cd6340122143009adac0eda"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/illuvium"
        },
        {
          label: "Twitter",
          url: "https://x.com/illuviumio"
        }
      ]
    }
  },
  {
    id: 14,
    projectName: "Pixels",
    content: "/assets/memes/game14.png",
    weight: 10,
    logo: "/assets/logos/logo_pixels.png",
    projectDetails: {
      network: "Ronin",
      price: "0.1794",
      marketCap: "137000000",
      priceChange24h: -1,
      contract: "0x7eae20d11ef8c779433eb24503def900b9d28ad7",
      buyLink: "https://www.binance.com/en/trade/PIXEL_USDT?ref=37754157",
      description: "Play-to-earn MMO with pixelated graphics and deep economic system",
      sector: "Play", 
      sectorUrl: "https://t.me/cryptomeda/",
      projectType: "GameFi",
      buttons: [
        {
          label: "Website",
          url: "pixels.xyz"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0xf6e28a6bf73980d573cb53b71112b6886896ebcb"
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
        },
        analytics: {
          linkClicks: {
            website: 0,
            telegram: 0,
            twitter: 0,
            sector: 0 // Added sector clicks tracking
          },
          taskCompletions: 0,
          viewCount: 0,
          lastViewed: new Date()
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
          description: firstMeme.projectDetails.description, // Added description
          projectType: firstMeme.projectDetails.projectType, // Added projectType
          type: firstMeme.projectDetails.sector || 'GameFi',
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