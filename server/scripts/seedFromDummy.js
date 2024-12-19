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
    content: "/assets/memes/meme1.png",
    weight: 1, // Higher number = higher chance of being shown
    logo: "/assets/logos/logo1.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000019",
      marketCap: "8700000000",
      priceChange24h: -1,
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      sector: "Meme", 
      buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933",
      buttons: [
        {
          label: "Website",
          url: "https://www.pepe.vip/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0xa43fe16908251ee70ef74718545e4fe6c5ccec9f?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko"
        },
        {
          label: "Twitter",
          url: "https://x.com/pepecoineth"
        }
      ]
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
      marketCap: "8700000000",
      priceChange24h: -1,
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      sector: "Meme", 
      buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933",
      buttons: [
        {
          label: "Website",
          url: "https://www.pepe.vip/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0xa43fe16908251ee70ef74718545e4fe6c5ccec9f?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko"
        },
        {
          label: "Twitter",
          url: "https://x.com/pepecoineth"
        }
      ]
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
      marketCap: "1300000000",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://x.com/pnutsolana"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/pnutportal"
        },
        {
          label: "Twitter",
          url: "https://x.com/pnutsolana"
        }
      ]
    }
  },
  {
    id: 4,
    projectName: "Pepe",
    content: "/assets/memes/meme4.png",
    weight: 1, // Higher number = higher chance of being shown
    logo: "/assets/logos/logo1.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000019",
      marketCap: "8700000000",
      priceChange24h: -1,
      contract: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      sector: "Meme", 
      buyLink: "https://app.uniswap.org/explore/tokens/ethereum/0x6982508145454ce325ddbe47a25d4ec3d2311933",
      buttons: [
        {
          label: "Website",
          url: "https://www.pepe.vip/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/eth/pools/0xa43fe16908251ee70ef74718545e4fe6c5ccec9f?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko"
        },
        {
          label: "Twitter",
          url: "https://x.com/pepecoineth"
        }
      ]
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
      marketCap: "1300000000",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://x.com/pnutsolana"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/pnutportal"
        },
        {
          label: "Twitter",
          url: "https://x.com/pnutsolana"
        }
      ]
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
      marketCap: "1300000000",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://x.com/pnutsolana"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/pnutportal"
        },
        {
          label: "Twitter",
          url: "https://x.com/pnutsolana"
        }
      ]
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
      marketCap: "1300000000",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://x.com/pnutsolana"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/pnutportal"
        },
        {
          label: "Twitter",
          url: "https://x.com/pnutsolana"
        }
      ]
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
      marketCap: "1500000000",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://popcatsolana.xyz/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/popcatsolana"
        },
        {
          label: "Twitter",
          url: "https://x.com/Popcatsolana"
        }
      ]
    }
  },
  {
    id: 9,
    projectName: "Pnut",
    content: "/assets/memes/meme9.png",
    weight: 2,
    logo: "/assets/logos/logo3.png",
    projectDetails: {
      network: "Solana",
      price: "1.25",
      marketCap: "1300000000",
      priceChange24h: -1,
      contract: "2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      buyLink: "https://raydium.io/swap/?outputCurrency=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump&inputMint=sol&outputMint=2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://x.com/pnutsolana"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/8oT91ooChsr7aHTHha9oJxKTYwUhZ75tjJ6bhtiggG5Y?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/pnutportal"
        },
        {
          label: "Twitter",
          url: "https://x.com/pnutsolana"
        }
      ]
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
      marketCap: "1500000000",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://popcatsolana.xyz/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/popcatsolana"
        },
        {
          label: "Twitter",
          url: "https://x.com/Popcatsolana"
        }
      ]
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
      marketCap: "1500000000",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://popcatsolana.xyz/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/popcatsolana"
        },
        {
          label: "Twitter",
          url: "https://x.com/Popcatsolana"
        }
      ]
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
      marketCap: "1500000000",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://popcatsolana.xyz/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/popcatsolana"
        },
        {
          label: "Twitter",
          url: "https://x.com/Popcatsolana"
        }
      ]
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
      marketCap: "1500000000",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://popcatsolana.xyz/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/popcatsolana"
        },
        {
          label: "Twitter",
          url: "https://x.com/Popcatsolana"
        }
      ]
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
      marketCap: "1500000000",
      priceChange24h: -1,
      contract: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      buyLink: "https://raydium.io/swap/?outputCurrency=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr&inputMint=sol&outputMint=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://popcatsolana.xyz/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/FRhB8L7Y9Qq41qZXYLtC2nw8An1RJfLLxRF2x9RwLLMo?utm_campaign=contract_selector&utm_medium=referral&utm_source=coingecko"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/popcatsolana"
        },
        {
          label: "Twitter",
          url: "https://x.com/Popcatsolana"
        }
      ]
    }
  },
  {
    id: 15,
    projectName: "Shiba Inu",
    content: "/assets/memes/meme15.png",
    weight: 1,
    logo: "/assets/logos/logo4.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.00002423",
      marketCap: "14000000000",
      priceChange24h: -1,
      contract: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      buyLink: "https://www.binance.com/en/trade/SHIB_USDT?ref=37754157&type=spot",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://shibatoken.com/"
        },
        {
          label: "Price Chart",
          url: "https://www.binance.com/en/trade/SHIB_USDT?ref=37754157&type=spot"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/GoatseusMaximusSolanaPortal"
        },
        {
          label: "Twitter",
          url: "https://x.com/Shibtoken"
        }
      ]
    }
  },
  {
    id: 16,
    projectName: "Bonk",
    content: "/assets/memes/meme16.png",
    weight: 1,
    logo: "/assets/logos/logo5.png",
    projectDetails: {
      network: "Solana",
      price: "0.00004122",
      marketCap: "3100000000",
      priceChange24h: -1,
      contract: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      buyLink: "https://raydium.io/swap/?inputCurrency=dezxaz8z7pnrnrjjz3wxborgixca6xjnb7yab1ppb263&outputCurrency=so11111111111111111111111111111111111111112&inputMint=sol&outputMint=DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://bonkcoin.com/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/BjZKz1z4UMjJPvPfKwTwjPErVBWnewnJFvcZB6minymy?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart"
        },
        {
          label: "Twitter",
          url: "https://x.com/bonk_inu"
        }
      ]
    }
  },
  {
    id: 17,
    projectName: "DogWifHat",
    content: "/assets/memes/meme17.png",
    weight: 1,
    logo: "/assets/logos/logo6.png",
    projectDetails: {
      network: "Solana",
      price: "3.08",
      marketCap: "3000000000",
      priceChange24h: -1,
      contract: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
      buyLink: "https://raydium.io/swap/?outputCurrency=EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm&inputMint=sol&outputMint=EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://dogwifcoin.org/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/EP2ib6dYdEeqD8MfE2ezHCxX3kP3K2eLKkirfPm5eyMx?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/dogwifcoin"
        },
        {
          label: "Twitter",
          url: "https://x.com/dogwifcoin"
        }
      ]
    }
  },
  {
    id: 18,
    projectName: "Floki",
    content: "/assets/memes/meme18.png",
    weight: 1,
    logo: "/assets/logos/logo7.png",
    projectDetails: {
      network: "Ethereum",
      price: "0.000213",
      marketCap: "2000000000",
      priceChange24h: -1,
      contract: "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e",
      buyLink: "https://www.binance.com/en/trade/FLOKI_USDT?ref=37754157&type=spot",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://floki.com/"
        },
        {
          label: "Price Chart",
          url: "https://www.binance.com/en/trade/FLOKI_USDT?ref=37754157&type=spot"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/FlokiInuToken"
        },
        {
          label: "Twitter",
          url: "https://x.com/realflokiinu"
        }
      ]
    }
  },
  {
    id: 19,
    projectName: "Brett",
    content: "/assets/memes/meme19.png",
    weight: 3,
    logo: "/assets/logos/logo8.png",
    projectDetails: {
      network: "Base",
      price: "0.1566",
      marketCap: "1500000000",
      priceChange24h: -1,
      contract: "0x532f27101965dd16442e59d40670faf5ebb142e4",
      buyLink: "https://app.uniswap.org/explore/tokens/base/0x532f27101965dd16442e59d40670faf5ebb142e4?inputCurrency=NATIVE",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://basebrett.com/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/base/pools/0x76bf0abd20f1e0155ce40a62615a90a709a6c3d8?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/basedbrett"
        },
        {
          label: "Twitter",
          url: "https://x.com/BasedBrett"
        }
      ]
    }
  },
  {
    id: 20,
    projectName: "Goatseus Maximus",
    content: "/assets/memes/meme20.png",
    weight: 1,
    logo: "/assets/logos/logo9.png",
    projectDetails: {
      network: "Solana",
      price: "0.7226",
      marketCap: "720000000",
      priceChange24h: -1,
      contract: "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
      buyLink: "https://raydium.io/swap/?outputCurrency=CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump&inputMint=sol&outputMint=CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
      sector: "Meme", 
      buttons: [
        {
          label: "Website",
          url: "https://goatchan.xyz/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/solana/pools/9Tb2ohu5P16BpBarqd3N27WnkF51Ukfs8Z1GzzLDxVZW?utm_source=coingecko&utm_medium=referral&utm_campaign=livechart"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/GoatseusMaximusSolanaPortal"
        },
        {
          label: "Twitter",
          url: "https://x.com/gospelofgoatse"
        }
      ]
    }
  },
  {
    id: 21,
    projectName: "Pixels",
    content: "/assets/memes/meme21.png",
    weight: 4,
    logo: "/assets/logos/logo10.png",
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
    id: 22,
    projectName: "Gala",
    content: "/assets/memes/meme22.png",
    weight: 5,
    logo: "/assets/logos/logo11.png",
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
  {
    id: 23,
    projectName: "Virtuals Protocol",
    content: "/assets/memes/meme23.png",
    weight: 3,
    logo: "/assets/logos/logo12.png",
    projectDetails: {
      network: "Base",
      price: "2.4",
      marketCap: "2400000000",
      priceChange24h: -1,
      contract: "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
      buyLink: "https://aerodrome.finance/swap?from=0x4200000000000000000000000000000000000006&to=0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
      sector: "AI", 
      buttons: [
        {
          label: "Website",
          url: "https://www.virtuals.io/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/base/pools/0xc200f21efe67c7f41b81a854c26f9cda80593065"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/virtuals"
        },
        {
          label: "Twitter",
          url: "https://x.com/virtuals_io"
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