//dummyMemes.js

/*
// client/src/assets/memes/
// ... import all your memes
import meme1 from '../assets/memes/meme1.png';
import meme2 from '../assets/memes/meme2.png';
import meme3 from '../assets/memes/meme3.png';
import meme4 from '../assets/memes/meme4.png';
import meme5 from '../assets/memes/meme5.png';
import meme6 from '../assets/memes/meme6.png';
import meme7 from '../assets/memes/meme7.png';
import meme8 from '../assets/memes/meme8.png';
import meme9 from '../assets/memes/meme9.png';
import meme10 from '../assets/memes/meme10.png';
import meme11 from '../assets/memes/meme11.png';
import meme12 from '../assets/memes/meme12.png';
import meme13 from '../assets/memes/meme13.png';
import meme14 from '../assets/memes/meme14.png';
import meme15 from '../assets/memes/meme15.png';
import meme16 from '../assets/memes/meme16.png';
import meme17 from '../assets/memes/meme17.png';
import meme18 from '../assets/memes/meme18.png';
import meme19 from '../assets/memes/meme19.png';
import meme20 from '../assets/memes/meme20.png';

// client/src/assets/logos/
// ... import all your logos
import logo1 from '../assets/logos/logo1.png';
import logo2 from '../assets/logos/logo2.png';
import logo3 from '../assets/logos/logo3.png';
import logo4 from '../assets/logos/logo4.png';
import logo5 from '../assets/logos/logo5.png';
import logo6 from '../assets/logos/logo6.png';
import logo7 from '../assets/logos/logo7.png';
import logo8 from '../assets/logos/logo8.png';
import logo9 from '../assets/logos/logo9.png';
*/


const dummyMemes = [

{
  id: 1,
  projectName: "Pixels",
  content: "/assets/memes/game1.png",
  weight: 3,
  logo: "/assets/logos/logo_pixels.png",
  engagement: {
    likes: 0,
    superLikes: 0,
    dislikes: 0
  },
  projectDetails: {
    network: "Ethereum",
    price: "0.1794",
    marketCap: "0.137B",
    priceChange24h: -1,
    contract: "0x3429d03c6f7521aec737a0bbf2e5ddcef2c3ae31",
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
  weight: 1,
  logo: "/assets/logos/logo_gala.png",
  engagement: {
    likes: 0,
    superLikes: 0,
    dislikes: 0
  },
  projectDetails: {
    network: "Ethereum",
    price: "0.0383",
    marketCap: "1.6B",
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

export default dummyMemes;