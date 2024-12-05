// server/scripts/seedFromDummy.js
const mongoose = require('mongoose');
const Meme = require('../src/models/Meme');
const Project = require('../src/models/Project');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dummyMemes = [
    {
      id: 1,
      projectName: "Pepe",
      content: "/memes/meme1.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo1.png",
      projectDetails: {
        network: "Ethereum",
        price: "0.000019",
        marketCap: 8700000000,
        priceChange24h: -1,
        contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
        website: "https://www.pepe.vip/",
        buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933",
        twitterUrl: "https://x.com/pepecoineth"
      }
    },
    {
      id: 2,
      projectName: "Pepe",
      content: "/memes/meme2.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo1.png",
      projectDetails: {
        network: "Ethereum",
        price: "0.000019", 
        marketCap: 8700000000,
        priceChange24h: -1,
        contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
        website: "https://www.pepe.vip/",
        buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933",
        twitterUrl: "https://x.com/pepecoineth"
      }
    },
    {
      id: 3,
      projectName: "Pnut",
      content: "/memes/meme3.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo3.png",
      projectDetails: {
        network: "Solana",
        price: "1.25",
        marketCap: 1300000000,
        priceChange24h: -1,
        contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
        website: "https://x.com/pnutsolana",
        buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
        twitterUrl: "https://x.com/pnutsolana",
        telegramUrl: "https://t.me/pnutportal"
      }
    },
    {
      id: 4,
      projectName: "Pepe",
      content: "/memes/meme4.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo1.png",
      projectDetails: {
        network: "Ethereum",
        price: "0.000019",
        marketCap: 8700000000,
        priceChange24h: -1,
        contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
        website: "https://www.pepe.vip/",
        buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933",
        twitterUrl: "https://x.com/pepecoineth"
      }
    },
    {
      id: 5,
      projectName: "Pnut",
      content: "/memes/meme5.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo3.png",
      projectDetails: {
        network: "Solana",
        price: "1.25",
        marketCap: 1300000000,
        priceChange24h: -1,
        contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
        website: "https://x.com/pnutsolana",
        buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
        twitterUrl: "https://x.com/pnutsolana",
        telegramUrl: "https://t.me/pnutportal"
      }
    },
    {
      id: 6,
      projectName: "Pnut",
      content: "/memes/meme6.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo3.png",
      projectDetails: {
        network: "Solana",
        price: "1.25",
        marketCap: 1300000000,
        priceChange24h: -1,
        contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
        website: "https://x.com/pnutsolana",
        buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
        twitterUrl: "https://x.com/pnutsolana",
        telegramUrl: "https://t.me/pnutportal"
      }
    },
    {
      id: 7,
      projectName: "Pnut",
      content: "/memes/meme7.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo3.png",
      projectDetails: {
        network: "Solana",
        price: "1.25",
        marketCap: 1300000000,
        priceChange24h: -1,
        contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
        website: "https://x.com/pnutsolana",
        buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
        twitterUrl: "https://x.com/pnutsolana",
        telegramUrl: "https://t.me/pnutportal"
      }
    },
    {
      id: 8,
      projectName: "Popcat",
      content: "/memes/meme8.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo2.png",
      projectDetails: {
        network: "Solana",
        price: "1.42",
        marketCap: 1500000000,
        priceChange24h: -1,
        contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        website: "https://popcatsolana.xyz/",
        buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        twitterUrl: "https://x.com/Popcatsolana",
        telegramUrl: "https://t.me/popcatsolana"
      }
    },
    {
      id: 9,
      projectName: "Pnut",
      content: "/memes/meme9.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo3.png",
      projectDetails: {
        network: "Solana",
        price: "1.25",
        marketCap: 1300000000,
        priceChange24h: -1,
        contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
        website: "https://x.com/pnutsolana",
        buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
        twitterUrl: "https://x.com/pnutsolana",
        telegramUrl: "https://t.me/pnutportal"
      }
    },
    {
      id: 10,
      projectName: "Popcat",
      content: "/memes/meme10.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo2.png",
      projectDetails: {
        network: "Solana",
        price: "1.42",
        marketCap: 1500000000,
        priceChange24h: -1,
        contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        website: "https://popcatsolana.xyz/",
        buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        twitterUrl: "https://x.com/Popcatsolana",
        telegramUrl: "https://t.me/popcatsolana"
      }
    },
    {
      id: 11,
      projectName: "Popcat",
      content: "/memes/meme11.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo2.png",
      projectDetails: {
        network: "Solana",
        price: "1.42",
        marketCap: 1500000000,
        priceChange24h: -1,
        contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        website: "https://popcatsolana.xyz/",
        buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        twitterUrl: "https://x.com/Popcatsolana",
        telegramUrl: "https://t.me/popcatsolana"
      }
    },
    {
      id: 12,
      projectName: "Popcat",
      content: "/memes/meme12.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo2.png",
      projectDetails: {
        network: "Solana",
        price: "1.42",
        marketCap: 1500000000,
        priceChange24h: -1,
        contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        website: "https://popcatsolana.xyz/",
        buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        twitterUrl: "https://x.com/Popcatsolana",
        telegramUrl: "https://t.me/popcatsolana"
      }
    },
    {
      id: 13,
      projectName: "Popcat",
      content: "/memes/meme13.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo2.png",
      projectDetails: {
        network: "Solana",
        price: "1.42",
        marketCap: 1500000000,
        priceChange24h: -1,
        contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        website: "https://popcatsolana.xyz/",
        buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        twitterUrl: "https://x.com/Popcatsolana",
        telegramUrl: "https://t.me/popcatsolana"
      }
    },
    {
      id: 14,
      projectName: "Popcat",
      content: "/memes/meme14.png",
      contentType: "image/png",
      weight: 1,
      logo: "/logos/logo2.png",
      projectDetails: {
        network: "Solana",
        price: "1.42",
        marketCap: 1500000000,
        priceChange24h: -1,
        contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        website: "https://popcatsolana.xyz/",
        buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
        twitterUrl: "https://x.com/Popcatsolana",
        telegramUrl: "https://t.me/popcatsolana"
      }
    },
    {
      id: 15,
      projectName: "Shiba Inu",
      content: "/memes/meme15.png",
      contentType: "image/png",
      weight: 2,
      logo: "/logos/logo4.png",
      projectDetails: {
        network: "Ethereum",
        price: "0.00002423",
        marketCap: 14000000000,
        priceChange24h: -1,
        contract: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
        website: "https://shibatoken.com/",
        buyLink: "https://www.binance.com/en/trade/SHIB_USDT",
        twitterUrl: "https://x.com/Shibtoken",
        telegramUrl: "https://t.me/ShibaInu_Dogecoinkiller"
      }
    },
    {
      id: 16,
      projectName: "Bonk",
      content: "/memes/meme16.png",
      contentType: "image/png",
      weight: 2,
      logo: "/logos/logo5.png",
      projectDetails: {
        network: "Solana",
        price: "0.00004122",
        marketCap: 3100000000,
        priceChange24h: -1,
        contract: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        website: "https://bonkcoin.com/",
        priceChart: "https://www.geckoterminal.com/solana/pools/BjZKz1z4UMjJPvPfKwTwjPErVBWnewnJFvcZB6minymy?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
        buyLink: "https://raydium.io/swap/?inputCurrency=dezxaz8z7pnrnrjjz3wxborgixca6xjnb7yab1ppb263&outputCurrency=so11111111111111111111111111111111111111112&inputMint=sol&outputMint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
        twitterUrl: "https://x.com/bonk_inu"
    }
  },
  {
    id: 17,
    projectName: "DogWifHat",
    content: "/memes/meme17.png",
    contentType: "image/png",
    weight: 2,
    logo: "/logos/logo6.png",
    projectDetails: {
      network: "Solana",
      price: "3.08",
      marketCap: 3000000000,
      priceChange24h: -1,
      contract: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
      website: "https://dogwifcoin.org/",
      priceChart: "https://www.geckoterminal.com/solana/pools/EP2ib6dYdEeqD8MfE2ezHCxX3kP3K2eLKkirfPm5eyMx?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://raydium.io/swap/?outputCurrency=EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm&inputMint=sol&outputMint=EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
      telegramUrl: "https://t.me/dogwifcoin",
      twitterUrl: "https://x.com/dogwifcoin"
    }
  },
  {
    id: 18,
    projectName: "Floki",
    content: "/memes/meme18.png",
    contentType: "image/png",
    weight: 2,
    logo: "/logos/logo7.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000213",
      marketCap: 2000000000,
      priceChange24h: -1,
      contract: "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e",
      website: "https://floki.com/",
      priceChart: "https://www.binance.com/en/trade/FLOKI_USDT?ref=37754157&type=spot",
      buyLink: "https://www.binance.com/en/trade/FLOKI_USDT?ref=37754157&type=spot",
      telegramUrl: "https://t.me/FlokiInuToken",
      twitterUrl: "https://x.com/realflokiinu"
    }
  },
  {
    id: 19,
    projectName: "Brett",
    content: "/memes/meme19.png",
    contentType: "image/png",
    weight: 2,
    logo: "/logos/logo8.png",
    projectDetails: {
      network: "Base",
      price: "0.1566",
      marketCap: 1500000000,
      priceChange24h: -1,
      contract: "0x532f27101965dd16442e59d40670faf5ebb142e4",
      website: "https://basebrett.com/",
      priceChart: "https://www.geckoterminal.com/base/pools/0x76bf0abd20f1e0155ce40a62615a90a709a6c3d8?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://app.uniswap.org/explore/tokens/base/0x532f27101965dd16442e59d40670faf5ebb142e4?inputCurrency=NATIVE",
      telegramUrl: "https://t.me/basedbrett",
      twitterUrl: "https://x.com/BasedBrett"
    }
  },
  {
    id: 20,
    projectName: "Goatseus Maximus",
    content: "/memes/meme20.png",
    contentType: "image/png",
    weight: 2,
    logo: "/logos/logo9.png",
    projectDetails: {
      network: "Solana",
      price: "0.7226",
      marketCap: 720000000,
      priceChange24h: -1,
      contract: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
      website: "https://goatchan.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://raydium.io/swap/?outputCurrency=CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump&inputMint=sol&outputMint=CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
      telegramUrl: "https://t.me/GoatseusMaximusSolanaPortal",
      twitterUrl: "https://x.com/gospelofgoatse"
    }
    }
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
  
        return Project.create({
          name: projectName,
          type: 'Meme',
          status: 'active',
          network: firstMeme.projectDetails.network,
          contractAddress: firstMeme.projectDetails.contract,
          social: {
            website: firstMeme.projectDetails.website,
            telegram: firstMeme.projectDetails.telegramUrl,
            twitter: firstMeme.projectDetails.twitterUrl
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