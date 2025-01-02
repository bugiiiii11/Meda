//client/src/services/priceService.jsx
import dummyMemes from '../data/dummyMemes';

class PriceService {
  constructor() {
  
    // Determine if we're in Telegram
  const isTelegram = !!window.Telegram?.WebApp;
  
  // Always use CoinGecko API in Telegram or production
  this.baseUrl = isTelegram || import.meta.env.VITE_ENV === 'production'
    ? 'https://api.coingecko.com/api/v3'
    : 'http://localhost:3001/api/coingecko';
    
    console.log('Price service base URL:', this.baseUrl);
      
    this.uniqueTokens = {
      'pixels': ['1','14'],
      'gala': ['2'],
      'immutable-x': ['3','4','5'],
      'axie-infinity': ['6','7'],
      'superfarm': ['8','9','10'],
      'illuvium': ['11','12','13']
    };
    
    this.cache = new Map();
    this.cacheTimeout = 3600000; // 1 hour
  }
  
  async initializeData() {
    try {
      console.log('Starting price data initialization...');
      const tokenIds = Object.keys(this.uniqueTokens).join(',');
      
      // Determine if we're in Telegram WebApp
      const isTelegram = !!window.Telegram?.WebApp;
      console.log('Is Telegram WebApp:', isTelegram);
  
      // Use appropriate URL and params
      const params = new URLSearchParams({
        ids: tokenIds,
        vs_currencies: 'usd',
        include_24hr_change: 'true',
        include_market_cap: 'true'
      });
  
      const url = `${this.baseUrl}/simple/price?${params}`;
      console.log('Fetching price data from:', url);
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
  
      console.log('Price data response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Received price data:', data);
  
      Object.entries(data).forEach(([tokenId, tokenData]) => {
        const formatted = {
          price: this.formatPrice(tokenData.usd),
          marketCap: this.formatMarketCap(tokenData.usd_market_cap),
          priceChange24h: this.formatPriceChange(tokenData.usd_24h_change),
          timestamp: Date.now()
        };
        
        // Log each token's formatted data
        console.log(`Formatting data for ${tokenId}:`, formatted);
  
        this.uniqueTokens[tokenId]?.forEach(memeId => {
          this.cache.set(memeId, {
            data: formatted,
            timestamp: Date.now()
          });
        });
      });
  
      console.log('Price data initialization complete');
      console.log('Cache contents:', [...this.cache.entries()]);
      return true;
  
    } catch (error) {
      console.error('Failed to load price data:', error);
      console.log('Loading fallback data due to error');
      this.loadFallbackData();
      return false;
    }
  }

  loadFallbackData() {
    const now = Date.now();
    
    dummyMemes.forEach(meme => {
      if (meme?.projectDetails) {
        this.cache.set(meme.id.toString(), {
          data: {
            price: meme.projectDetails.price,
            marketCap: meme.projectDetails.marketCap,
            priceChange24h: meme.projectDetails.priceChange24h || 0,
            timestamp: now
          },
          timestamp: now
        });
      }
    });
  }

  getTokenDataByMemeId(memeId) {
    const cachedData = this.cache.get(memeId?.toString());
    if (cachedData) return cachedData.data;
    return this.getFallbackDataForMemeId(memeId);
  }

  getFallbackDataForMemeId(memeId) {
    const meme = dummyMemes.find(m => m.id === Number(memeId));
    
    if (meme?.projectDetails) {
      return {
        price: meme.projectDetails.price,
        marketCap: meme.projectDetails.marketCap,
        priceChange24h: Number(meme.projectDetails.priceChange24h) || 0,
        timestamp: Date.now()
      };
    }

    return {
      price: '0.00',
      marketCap: '0',
      priceChange24h: 0,
      timestamp: Date.now()
    };
  }

  formatPrice(price) {
    if (!price) return '0.00';
    const numPrice = typeof price === 'string' ? Number(price) : price;
    if (isNaN(numPrice)) return '0.00';
    if (numPrice < 0.0001) return numPrice.toFixed(8);
    if (numPrice < 0.01) return numPrice.toFixed(6);
    if (numPrice < 1) return numPrice.toFixed(4);
    return numPrice.toFixed(2);
  }

  formatPriceChange(change) {
    if (!change) return 0;
    return Number(Number(change).toFixed(2));
  }

  formatMarketCap(value) {
    if (!value) return '0';
    const num = Number(value);
    if (isNaN(num)) return '0';
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return value.toFixed(2);
  }
}

const priceService = new PriceService();
export { priceService };