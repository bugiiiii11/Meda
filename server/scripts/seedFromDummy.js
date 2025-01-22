// server/scripts/seedFromDummy.js
const mongoose = require('mongoose');
const Meme = require('../src/models/Meme');
const Project = require('../src/models/Project');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dummyMemes = [
    
  {
    id: 1,
    projectName: "Hamster Kombat",
    content: "/assets/memes/game1.png",
    weight: 1,
    logo: "/assets/logos/logo_hamster.png",
    projectDetails: {
      hasToken: true,
      network: "TON",
      price: "0.003",
      marketCap: "204000000",
      priceChange24h: -1,
      contract: "EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo",
      buyLink: "https://www.binance.com/en/trade/HMSTR_USDT?ref=37754157",
      description: "Unleash your inner CEO!",
      sector: "Play", 
      sectorUrl: "https://t.me/hamster_koMbat_bot/start?startapp=kentId1812207291",
      projectType: "Game Hub",
      buttons: [
        {
          label: "Open Website",
          url: "https://hamsterkombat.io/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/ton/pools/EQAlNk4VwBlVV-sQr0UYe5souU_xbTof54Fd9qewwN1N7pXL"
        },
        {
          label: "Join Telegram",
          url: "https://discord.com/invite/pixels"
        },
        {
          label: "Follow X",
          url: "https://x.com/hamster_kombat"
        },
        {
          label: "Follow Youtube",
          url: "https://x.com/hamster_kombat"
        }
      ]
    }
  },
  {
    id: 2,
    projectName: "Hamster Kombat",
    content: "/assets/memes/game2.png",
    weight: 1,
    logo: "/assets/logos/logo_hamster.png",
    projectDetails: {
      hasToken: true,
      network: "TON",
      price: "0.003",
      marketCap: "204000000",
      priceChange24h: -1,
      contract: "EQAJ8uWd7EBqsmpSWaRdf_I-8R8-XHwh3gsNKhy-UrdrPcUo",
      buyLink: "https://www.binance.com/en/trade/HMSTR_USDT?ref=37754157",
      description: "Unleash your inner CEO!",
      sector: "Play", 
      sectorUrl: "https://t.me/hamster_koMbat_bot/start?startapp=kentId1812207291",
      projectType: "Game Hub",
      buttons: [
        {
          label: "Open Website",
          url: "https://hamsterkombat.io/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/ton/pools/EQAlNk4VwBlVV-sQr0UYe5souU_xbTof54Fd9qewwN1N7pXL"
        },
        {
          label: "Join Telegram",
          url: "https://discord.com/invite/pixels"
        },
        {
          label: "Follow X",
          url: "https://x.com/hamster_kombat"
        },
        {
          label: "Follow Youtube",
          url: "https://x.com/hamster_kombat"
        }
      ]
    }
  },
  {
    id: 3,
    projectName: "Catizen",
    content: "/assets/memes/game3.png",
    weight: 1,
    logo: "/assets/logos/logo_catizen.png",
    projectDetails: {
      hasToken: true,
      network: "TON",
      price: "0.29",
      marketCap: "0.06B",
      priceChange24h: -1,
      contract: "EQD-cvR0Nz6XAyRBvbhz-abTrRC6sI5tvHvvpeQraV9UAAD7",
      buyLink: "https://www.binance.com/en/trade/CATI_USDT?ref=37754157&type=spot",
      description: "Play for airdrop🪂 Heal the world!",
      sector: "Play", 
      sectorUrl: "https://t.me/catizenbot/gameapp?startapp=rp_47060003",
      projectType: "Tapping Game",
      buttons: [
        {
          label: "Open Website",
          url: "https://catizen.ai/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/ton/pools/EQBJ_X3ysvgOGUo6XB3eUTCvagarGeA3X-QD3lxSqZzQbQ4w"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/CatizenAnn"
        },
        {
          label: "Follow X",
          url: "https://x.com/CatizenAI"
        }
      ]
    }
  },
  {
    id: 4,
    projectName: "Catizen",
    content: "/assets/memes/game4.png",
    weight: 1,
    logo: "/assets/logos/logo_catizen.png",
    projectDetails: {
      hasToken: true,
      network: "TON",
      price: "0.29",
      marketCap: "0.06B",
      priceChange24h: -1,
      contract: "EQD-cvR0Nz6XAyRBvbhz-abTrRC6sI5tvHvvpeQraV9UAAD7",
      buyLink: "https://www.binance.com/en/trade/CATI_USDT?ref=37754157&type=spot",
      description: "Play for airdrop🪂 Heal the world!",
      sector: "Play", 
      sectorUrl: "https://t.me/catizenbot/gameapp?startapp=rp_47060003",
      projectType: "Tapping Game",
      buttons: [
        {
          label: "Open Website",
          url: "https://catizen.ai/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/ton/pools/EQBJ_X3ysvgOGUo6XB3eUTCvagarGeA3X-QD3lxSqZzQbQ4w"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/CatizenAnn"
        },
        {
          label: "Follow X",
          url: "https://x.com/CatizenAI"
        }
      ]
    }
  },
  {
    id: 5,
    projectName: "Play!",
    content: "/assets/memes/game5.png",
    weight: 1,
    logo: "/assets/logos/logo_play.png",
    projectDetails: {
      hasToken: true,
      network: "Base",
      price: "1.38",
      marketCap: "2.3B",
      priceChange24h: -1,
      contract: "0x7404ac09adf614603d9c16a7ce85a1101f3514ba",
      buyLink: "https://app.uniswap.org/explore/tokens/base/0x7404ac09adf614603d9c16a7ce85a1101f3514ba",
      description: "Gaming protocol that turbocharges games!",
      sector: "Play", 
      sectorUrl: "https://t.me/play_gamestore_bot/",
      projectType: "Game Hub",
      buttons: [
        {
          label: "Open Website",
          url: "https://theplay.network/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/base/pools/0x9d029df22ceefc6245d382a41bc232c8dc988bf9"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/PLAY_GameStore_Ann"
        },
        {
          label: "Follow X",
          url: "https://x.com/0xplay_network"
        },
        {
          label: "Join Discord",
          url: "https://x.com/0xplay_network"
        }
      ]
    }
  },
  {
    id: 6,
    projectName: "Play!",
    content: "/assets/memes/game6.png",
    weight: 1,
    logo: "/assets/logos/logo_play.png",
    projectDetails: {
      hasToken: true,
      network: "Base",
      price: "1.38",
      marketCap: "2.3B",
      priceChange24h: -1,
      contract: "0x7404ac09adf614603d9c16a7ce85a1101f3514ba",
      buyLink: "https://app.uniswap.org/explore/tokens/base/0x7404ac09adf614603d9c16a7ce85a1101f3514ba",
      description: "Gaming protocol that turbocharges games!",
      sector: "Play", 
      sectorUrl: "https://t.me/play_gamestore_bot/",
      projectType: "Game Hub",
      buttons: [
        {
          label: "Open Website",
          url: "https://theplay.network/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/base/pools/0x9d029df22ceefc6245d382a41bc232c8dc988bf9"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/PLAY_GameStore_Ann"
        },
        {
          label: "Follow X",
          url: "https://x.com/0xplay_network"
        },
        {
          label: "Join Discord",
          url: "https://x.com/0xplay_network"
        }
      ]
    }
  },
  {
    id: 7,
    projectName: "TONs of Dungeons",
    content: "/assets/memes/game7.png",
    weight: 1,
    logo: "/assets/logos/logo_dungeons.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Tap on blocks to discover rewards",
      sector: "Play", 
      sectorUrl: "https://t.me/tonsofdungeons_bot/TOD?startapp=cXd5q9uDl0-wSmOjSC-ipA",
      projectType: "Tapping Game",
      buttons: [
        {
          label: "Website",
          url: "https://tonsofdungeons.com/"
        },
        {
          label: "Price Chart",
          url: "N/A"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/tonsofdungeons_bot/"
        },
        {
          label: "Follow X",
          url: "https://x.com/tonsofdungeons"
        }
      ]
    }
  },
  {
    id: 8,
    projectName: "TONs of Dungeons",
    content: "/assets/memes/game8.png",
    weight: 1,
    logo: "/assets/logos/logo_dungeons.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Tap on blocks to discover rewards",
      sector: "Play", 
      sectorUrl: "https://t.me/tonsofdungeons_bot/TOD?startapp=cXd5q9uDl0-wSmOjSC-ipA",
      projectType: "Tapping Game",
      buttons: [
        {
          label: "Website",
          url: "https://tonsofdungeons.com/"
        },
        {
          label: "Price Chart",
          url: "N/A"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/tonsofdungeons_bot/"
        },
        {
          label: "Follow X",
          url: "https://x.com/tonsofdungeons"
        }
      ]
    }
  },
  {
    id: 9,
    projectName: "Dogiators",
    content: "/assets/memes/game9.png",
    weight: 1,
    logo: "/assets/logos/logo_dogiators.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Grow your dog and fight with other players!",
      sector: "Play", 
      sectorUrl: "https://t.me/Dogiators_bot/game?startapp=htiHhZ7ACF2YDNaw",
      projectType: "PvP Game",
      buttons: [
        {
          label: "Join Telegram",
          url: "https://t.me/dogiators"
        }
      ]
    }
  },
  {
    id: 10,
    projectName: "Dogiators",
    content: "/assets/memes/game10.png",
    weight: 1,
    logo: "/assets/logos/logo_dogiators.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Grow your dog and fight with other players!",
      sector: "Play", 
      sectorUrl: "https://t.me/Dogiators_bot/game?startapp=htiHhZ7ACF2YDNaw",
      projectType: "PvP Game",
      buttons: [
        {
          label: "Join Telegram",
          url: "https://t.me/dogiators"
        }
      ]
    }
  },
  {
    id: 11,
    projectName: "Dragon Slighter",
    content: "/assets/memes/game11.png",
    weight: 1,
    logo: "/assets/logos/logo_dragon.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Web3 snake game!",
    sector: "Play", 
    sectorUrl: "https://t.me/DragonSlither_bot/Dragon?startapp=460453938",
    projectType: "Snake Game",
    buttons: [
      {
        label: "Website",
        url: "https://dragonslither.com/"
      },
      {
        label: "Join Telegram",
        url: "https://t.me/DragonSlither"
      },
      {
        label: "Follow X",
        url: "https://x.com/Dragon_Slither"
        }
      ]
    }
  },
  {
    id: 12,
    projectName: "Dragon Slighter",
    content: "/assets/memes/game12.png",
    weight: 1,
    logo: "/assets/logos/logo_dragon.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Web3 snake game!",
      sector: "Play", 
      sectorUrl: "https://t.me/DragonSlither_bot/Dragon?startapp=460453938",
      projectType: "Snake Game",
      buttons: [
        {
          label: "Website",
          url: "https://dragonslither.com/"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/DragonSlither"
        },
        {
          label: "Follow X",
          url: "https://x.com/Dragon_Slither"
        }
      ]
    }
  },
  {
    id: 13,
    projectName: "Rocky Rabit",
    content: "/assets/memes/game13.png",
    weight: 1,
    logo: "/assets/logos/logo_rocky.png",
    projectDetails: {
      hasToken: true,
      network: "TON",
      price: "0.003",
      marketCap: "0.24B",
      priceChange24h: -1,
      contract: "EQCD7lrrxpOcq5A5R6nTLeF1kuIbl1BKCe5OnanGe3cB4FVB",
      buyLink: "https://app.ston.fi/swap?ft=EQCD7lrrxpOcq5A5R6nTLeF1kuIbl1BKCe5OnanGe3cB4FVB&tt=EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c&chartVisible=false",
      description: "Bet on BTC going up or down!",
      sector: "Play", 
      sectorUrl: "https://t.me/rocky_rabbit_bot/play?startapp=frId460453938",
      projectType: "Gamble",
      buttons: [
        {
          label: "Website",
          url: "https://rockyrabbit.io/"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/rockyrabbitio"
        },
        {
          label: "Follow X",
          url: "https://x.com/rockyrabbitio"
        },
        {
          label: "Youtube",
          url: "https://www.youtube.com/@rockyrabbitio"
        }
      ]
    }
  },
  {
    id: 14,
    projectName: "Rocky Rabit",
    content: "/assets/memes/game14.png",
    weight: 1,
    logo: "/assets/logos/logo_rocky.png",
    projectDetails: {
      hasToken: true,
      network: "TON",
      price: "0.003",
      marketCap: "0.24B",
      priceChange24h: -1,
      contract: "EQCD7lrrxpOcq5A5R6nTLeF1kuIbl1BKCe5OnanGe3cB4FVB",
      buyLink: "https://app.ston.fi/swap?ft=EQCD7lrrxpOcq5A5R6nTLeF1kuIbl1BKCe5OnanGe3cB4FVB&tt=EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c&chartVisible=false",
      description: "Bet on BTC going up or down!",
      sector: "Play", 
      sectorUrl: "https://t.me/rocky_rabbit_bot/play?startapp=frId460453938",
      projectType: "Gamble",
      buttons: [
        {
          label: "Website",
          url: "https://rockyrabbit.io/"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/rockyrabbitio"
        },
        {
          label: "Follow X",
          url: "https://x.com/rockyrabbitio"
        },
        {
          label: "Youtube",
          url: "https://www.youtube.com/@rockyrabbitio"
        }
      ]
    }
  },
  {
    id: 15,
    projectName: "WATcoin",
    content: "/assets/memes/game15.png",
    weight: 1,
    logo: "/assets/logos/logo_wat.png",
    projectDetails: {
      hasToken: true, 
      network: "TON",
      price: "0.003",
      marketCap: "0.24B",
      priceChange24h: -1,
      contract: "EQCEqz2x3-Ub_EO4Y5798NNoqKw1tP_tJ6b9y-X0C4uvs8Zf",
      buyLink: "https://app.ston.fi/swap?ft=EQCqnhZndBGbwjPpV8K_8WOK58ZkQPXlS_bshau9DKWnAF-p&tt=EQCEqz2x3-Ub_EO4Y5798NNoqKw1tP_tJ6b9y-X0C4uvs8Zf&chartVisible=false",
      description: "Play GAMEE games, earn WAT!",
      sector: "Play", 
      sectorUrl: "https://t.me/gamee/start?startapp=ref_460453938",
      projectType: "Game Hub",
      buttons: [
        {
          label: "Website",
          url: "https://points.gamee.com/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/ton/pools/EQA4c2edlFI4soyArI9Qa71dzt1a2zkO-a44u5RrQ7QG8rA9"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/watcoin"
        },
        {
          label: "Follow X",
          url: "https://x.com/WatBird"
        }
      ]
    }
  },
  {
    id: 16,
    projectName: "WATcoin",
    content: "/assets/memes/game16.png",
    weight: 1,
    logo: "/assets/logos/logo_wat.png",
    projectDetails: {
      hasToken: true, 
      network: "TON",
      price: "0.003",
      marketCap: "0.24B",
      priceChange24h: -1,
      contract: "EQCEqz2x3-Ub_EO4Y5798NNoqKw1tP_tJ6b9y-X0C4uvs8Zf",
      buyLink: "https://app.ston.fi/swap?ft=EQCqnhZndBGbwjPpV8K_8WOK58ZkQPXlS_bshau9DKWnAF-p&tt=EQCEqz2x3-Ub_EO4Y5798NNoqKw1tP_tJ6b9y-X0C4uvs8Zf&chartVisible=false",
      description: "Play GAMEE games, earn WAT!",
      sector: "Play", 
      sectorUrl: "https://t.me/gamee/start?startapp=ref_460453938",
      projectType: "Game Hub",
      buttons: [
        {
          label: "Website",
          url: "https://points.gamee.com/"
        },
        {
          label: "Price Chart",
          url: "https://www.geckoterminal.com/ton/pools/EQA4c2edlFI4soyArI9Qa71dzt1a2zkO-a44u5RrQ7QG8rA9"
        },
        {
          label: "Join Telegram",
          url: "https://t.me/watcoin"
        },
        {
          label: "Follow X",
          url: "https://x.com/WatBird"
        }
      ]
    }
  },
  {
    id: 17,
    projectName: "HashCats",
    content: "/assets/memes/game17.png",
    weight: 1,
    logo: "/assets/logos/logo_hash.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Build your mining empire and reign as the richest crypto cat!",
      sector: "Play", 
      sectorUrl: "https://t.me/hash_cats_bot/app?startapp=fGoPIoI2Gb",
      projectType: "Mining Game",
      buttons: [
        {
          label: "Join Telegram",
          url: "https://t.me/hash_cats"
        },
        {
          label: "Follow X",
          url: "https://x.com/HashCatsGame"
        },
        {
          label: "TGE Info",
          url: "https://x.com/HashCatsGame/status/1880599565436375486"
        }
      ]
    }
  },
  {
    id: 18,
    projectName: "HashCats",
    content: "/assets/memes/game18.png",
    weight: 1,
    logo: "/assets/logos/logo_hash.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Build your mining empire and reign as the richest crypto cat!",
      sector: "Play", 
      sectorUrl: "https://t.me/hash_cats_bot/app?startapp=fGoPIoI2Gb",
      projectType: "Mining Game",
      buttons: [
        {
          label: "Join Telegram",
          url: "https://t.me/hash_cats"
        },
        {
          label: "Follow X",
          url: "https://x.com/HashCatsGame"
        },
        {
          label: "TGE Info",
          url: "https://x.com/HashCatsGame/status/1880599565436375486"
        }
      ]
    }
  },
  {
    id: 19,
    projectName: "Boinkers",
    content: "/assets/memes/game19.png",
    weight: 1,
    logo: "/assets/logos/logo_boinkers.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Become a shitcoinaire!",
      sector: "Play", 
      sectorUrl: "https://t.me/boinker_bot/boinkapp?startapp=boink1812207291",
      projectType: "Tapping Game",
      buttons: [
        {
          label: "Join Telegram",
          url: "https://t.me/boinkersNews"
        },
        {
          label: "Follow X",
          url: "https://x.com/BoinkersIO"
        }
      ]
    }
  },
  {
    id: 20,
    projectName: "Boinkers",
    content: "/assets/memes/game20.png",
    weight: 1,
    logo: "/assets/logos/logo_boinkers.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Become a shitcoinaire!",
      sector: "Play", 
      sectorUrl: "https://t.me/boinker_bot/boinkapp?startapp=boink1812207291",
      projectType: "Tapping Game",
      buttons: [
        {
          label: "Join Telegram",
          url: "https://t.me/boinkersNews"
        },
        {
          label: "Follow X",
          url: "https://x.com/BoinkersIO"
        }
      ]
    }
  },
  {
    id: 21,
    projectName: "Snake Lite",
    content: "/assets/memes/game21.png",
    weight: 1,
    logo: "/assets/logos/logo_snakelite.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Web3 snake game!",
      sector: "Play", 
      sectorUrl: "https://t.me/Snakelite_official_bot/Snakelite?startapp=L9TklWjj",
      projectType: "Snake Game",
      buttons: [
        {
          label: "Open Website",
          url: "https://snakelite.io/"
        },
        {
          label: "Telegram Channel",
          url: "https://t.me/SnakeLiteAnnouncement"
        },
        {
          label: "Follow X",
          url: "https://x.com/snakeliteio"
        },
        {
          label: "Telegram Chat",
          url: "https://t.me/SnakeLiteio"
        }
      ]
    }
  },
  {
    id: 22,
    projectName: "Snake Lite",
    content: "/assets/memes/game22.png",
    weight: 1,
    logo: "/assets/logos/logo_snakelite.png",
    projectDetails: {
      hasToken: false, 
      network: null,
      price: null,
      marketCap: null,
      priceChange24h: null,
      contract: null,
      buyLink: null,
      description: "Web3 snake game!",
      sector: "Play", 
      sectorUrl: "https://t.me/Snakelite_official_bot/Snakelite?startapp=L9TklWjj",
      projectType: "Snake Game",
      buttons: [
        {
          label: "Open Website",
          url: "https://snakelite.io/"
        },
        {
          label: "Telegram Channel",
          url: "https://t.me/SnakeLiteAnnouncement"
        },
        {
          label: "Follow X",
          url: "https://x.com/snakeliteio"
        },
        {
          label: "Telegram Chat",
          url: "https://t.me/SnakeLiteio"
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