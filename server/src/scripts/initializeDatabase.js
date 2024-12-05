const mongoose = require('mongoose');
const Meme = require('../models/Meme');
require('dotenv').config({ path: '../../.env' });

// Helper function to convert market cap string to number
function parseMarketCap(mcap) {
  if (typeof mcap === 'number') return mcap;
  const value = parseFloat(mcap);
  if (mcap.endsWith('B')) return value * 1000000000;
  if (mcap.endsWith('M')) return value * 1000000;
  if (mcap.endsWith('K')) return value * 1000;
  return value;
}

const memesToAdd = [
  {
    id: 1,
    projectName: "Pepe",
    content: "/assets/memes/meme1.png",
    weight: 1,
    logo: "/assets/logos/logo1.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000019",
      marketCap: "8.7B",
      priceChange24h: -1,
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      website: "https://www.pepe.vip/",
      socialLinks: {
        twitter: "https://x.com/pepecoineth",
        website: "https://www.pepe.vip/"
      },
      buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933"
    }
  },
  {
    id: 2,
    projectName: "Pepe",
    content: "/assets/memes/meme2.png",
    weight: 1,
    logo: "/assets/logos/logo1.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000019",
      marketCap: "8.7B",
      priceChange24h: -1,
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      website: "https://www.pepe.vip/",
      socialLinks: {
        twitter: "https://x.com/pepecoineth",
        website: "https://www.pepe.vip/"
      },
      buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933"
    }
  },
  {
    id: 3,
    projectName: "Pnut",
    content: "/assets/memes/meme3.png",
    weight: 1,
    logo: "/assets/logos/logo3.png",
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      website: "https://x.com/pnutsolana",
      socialLinks: {
        telegram: "https://t.me/pnutportal",
        twitter: "https://x.com/pnutsolana",
        website: "https://x.com/pnutsolana"
      },
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump"
    }
  },
  {
    id: 4,
    projectName: "Pepe",
    content: "/assets/memes/meme4.png",
    weight: 1,
    logo: "/assets/logos/logo1.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000019",
      marketCap: "8.7B",
      priceChange24h: -1,
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      website: "https://www.pepe.vip/",
      priceChart: "https://www.geckoterminal.com/eth/pools/0xa43fe16908251ee70ef74718545e4fe6c5ccec9f?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933",
      twitterUrl: "https://x.com/pepecoineth"
    }
  },
  {
    id: 5,
    projectName: "Pnut",
    content: "/assets/memes/meme5.png",
    weight: 1,
    logo: "/assets/logos/logo3.png",
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      website: "https://x.com/pnutsolana",
      priceChart: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      telegramUrl: "https://t.me/pnutportal",
      twitterUrl: "https://x.com/pnutsolana"
    }
  },
  {
    id: 6,
    projectName: "Pnut",
    content: "/assets/memes/meme6.png",
    weight: 1,
    logo: "/assets/logos/logo3.png",
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      website: "https://x.com/pnutsolana",
      priceChart: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      telegramUrl: "https://t.me/pnutportal",
      twitterUrl: "https://x.com/pnutsolana"
    }
  },
  {
    id: 7,
    projectName: "Pnut",
    content: "/assets/memes/meme7.png",
    weight: 1,
    logo: "/assets/logos/logo3.png",
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      website: "https://x.com/pnutsolana",
      priceChart: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      telegramUrl: "https://t.me/pnutportal",
      twitterUrl: "https://x.com/pnutsolana"
    }
  },
  {
    id: 8,
    projectName: "Popcat",
    content: "/assets/memes/meme8.png",
    weight: 1,
    logo: "/assets/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  {
    id: 9,
    projectName: "Pnut",
    content: "/assets/memes/meme9.png",
    weight: 1,
    logo: "/assets/logos/logo3.png",
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1.3B",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      website: "https://x.com/pnutsolana",
      priceChart: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      telegramUrl: "https://t.me/pnutportal",
      twitterUrl: "https://x.com/pnutsolana"
    }
  },
  {
    id: 10,
    projectName: "Popcat",
    content: "/assets/memes/meme10.png",
    weight: 1,
    logo: "/assets/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  {
    id: 11,
    projectName: "Popcat",
    content: "/assets/memes/meme11.png",
    weight: 1,
    logo: "/assets/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  {
    id: 12,
    projectName: "Popcat",
    content: "/assets/memes/meme12.png",
    weight: 1,
    logo: "/assets/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  {
    id: 13,
    projectName: "Popcat",
    content: "/assets/memes/meme13.png",
    weight: 1,
    logo: "/assets/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  {
    id: 14,
    projectName: "Popcat",
    content: "/assets/memes/meme14.png",
    weight: 1,
    logo: "/assets/logos/logo2.png",
    projectDetails: {
      network: "Solana",
      price: "1.42",
      marketCap: "1.5B",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      website: "https://popcatsolana.xyz/",
      priceChart: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      telegramUrl: "https://t.me/popcatsolana",
      twitterUrl: "https://x.com/Popcatsolana"
    }
  },
  
  {
    id: 15,
    projectName: "Shiba Inu",
    content: "/assets/memes/meme15.png",
    weight: 2,
    logo: "/assets/logos/logo4.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.00002423",
      marketCap: "14B",
      priceChange24h: -1,
      contract: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      website: "https://shibatoken.com/",
      socialLinks: {
        telegram: "https://t.me/ShibaInu_Dogecoinkiller",
        twitter: "https://x.com/Shibtoken",
        website: "https://shibatoken.com/"
      },
      buyLink: "https://www.binance.com/en/trade/SHIB_USDT"
    }
  },
  {
    id: 16,
    projectName: "Bonk",
    content: "/assets/memes/meme16.png",
    weight: 2,
    logo: "/assets/logos/logo5.png",
    projectDetails: {
      network: "Solana",
      price: "0.00004122",
      marketCap: "3.1B",
      priceChange24h: -1,
      contract: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      website: "https://bonkcoin.com/",
      socialLinks: {
        twitter: "https://x.com/bonk_inu",
        website: "https://bonkcoin.com/"
      },
      buyLink: "https://raydium.io/swap/?inputCurrency=dezxaz8z7pnrnrjjz3wxborgixca6xjnb7yab1ppb263"
    }
  },
  {
    id: 17,
    projectName: "DogWifHat",
    content: "/assets/memes/meme17.png",
    weight: 2,
    logo: "/assets/logos/logo6.png",
    projectDetails: {
      network: "Solana",
      price: "3.08",
      marketCap: "3B",
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
    content: "/assets/memes/meme18.png",
    weight: 2,
    logo: "/assets/logos/logo7.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000213",
      marketCap: "2B",
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
    content: "/assets/memes/meme19.png",
    weight: 2,
    logo: "/assets/logos/logo8.png",
    projectDetails: {
      network: "Base",
      price: "0.1566",
      marketCap: "1.5B",
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
    content: "/assets/memes/meme20.png",
    weight: 2,
    logo: "/assets/logos/logo9.png",
    projectDetails: {
      network: "Solana",
      price: "0.7226",
      marketCap: "0.72B",
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

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // Clear existing memes
    await Meme.deleteMany({});
    console.log('Cleared existing memes');

    // Transform memes to match our schema
    const memesToInsert = memesToAdd.map(meme => {
      // Normalize social links
      const socialLinks = {
        telegram: meme.projectDetails.telegramUrl || meme.projectDetails.socialLinks?.telegram || null,
        twitter: meme.projectDetails.twitterUrl || meme.projectDetails.socialLinks?.twitter || null,
        website: meme.projectDetails.website || meme.projectDetails.socialLinks?.website || null
      };

      return {
        projectName: meme.projectName,
        content: meme.content,
        contentType: 'image/png',
        logo: meme.logo,
        projectDetails: {
          network: meme.projectDetails.network,
          marketCap: parseMarketCap(meme.projectDetails.marketCap),
          price: parseFloat(meme.projectDetails.price),
          priceChange24h: meme.projectDetails.priceChange24h,
          contract: meme.projectDetails.contract,
          website: meme.projectDetails.website,
          buyLink: meme.projectDetails.buyLink,
          socialLinks
        },
        displaySettings: {
          weight: meme.weight || 1,
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
    });

    // Insert all memes
    const insertedMemes = await Meme.insertMany(memesToInsert);
    console.log(`Successfully inserted ${insertedMemes.length} memes`);

    // Show sample of inserted data
    const sampleMeme = await Meme.findOne();
    console.log('\nSample inserted meme:', JSON.stringify(sampleMeme, null, 2));

    // Log verification data
    const memeCount = await Meme.countDocuments();
    console.log(`\nVerification:\nTotal memes in database: ${memeCount}`);

    // Show all project names and networks
    const allMemes = await Meme.find().select('projectName projectDetails.network');
    console.log('\nInserted memes:');
    allMemes.forEach(meme => {
      console.log(`- ${meme.projectName} (${meme.projectDetails?.network})`);
    });

    console.log('\nDatabase initialization completed successfully!');

  } catch (error) {
    console.error('Error:', error);
    // Log more details about the error
    if (error.errors) {
      console.log('\nValidation errors:');
      Object.keys(error.errors).forEach(key => {
        console.log(`- ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
}

initializeDatabase();
