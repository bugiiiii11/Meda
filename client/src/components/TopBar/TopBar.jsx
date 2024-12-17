import React, { useEffect, useState } from 'react';
import { priceService } from '../../services/priceService';

const TopBar = ({ meme, onDetailsClick, isDetailsOpen }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const fetchPriceData = async () => {
      if (!meme?.id) {
        console.log('No meme ID provided');
        setLoading(false);
        return;
      }

      console.log('Fetching price data for meme:', meme.id, meme.projectName);

      try {
        setLoading(true);
        setError(null);
        const data = await priceService.getTokenDataByMemeId(meme.id);
        
        if (isMounted) {
          console.log('Received price data:', data);
          setPriceData(data);
        }
      } catch (err) {
        console.error('Error fetching price data:', err);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying (${retryCount}/${maxRetries})...`);
          setTimeout(fetchPriceData, 2000 * retryCount);
        } else {
          setError('Unable to fetch latest price data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPriceData();
    const intervalId = setInterval(fetchPriceData, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [meme]);

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    const numPrice = Number(price);
    if (isNaN(numPrice)) return '$0.00';
    if (numPrice < 0.0001) return `$${numPrice.toFixed(8)}`;
    if (numPrice < 0.01) return `$${numPrice.toFixed(6)}`;
    if (numPrice < 1) return `$${numPrice.toFixed(4)}`;
    return `$${numPrice.toFixed(2)}`;
  };

  const formatMarketCap = (marketCap) => {
    if (!marketCap) return '$0.00';
    
    // If marketCap already includes B/M suffix, return as is with $ prefix
    if (typeof marketCap === 'string' && (marketCap.includes('B') || marketCap.includes('M'))) {
      return `$${marketCap}`;
    }
  
    // Convert to number and format
    const num = Number(marketCap);
    if (isNaN(num)) return '$0.00';
  
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(1)}B`;
    }
    if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(1)}M`;
    }
    return `$${num.toLocaleString()}`;
  };

  const handleBuyClick = () => {
    setIsButtonLoading(true);
    try {
      window.open(meme?.projectDetails?.buyLink, '_blank', 'noopener,noreferrer');
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <div className="w-full px-4">
      <div className="max-w-md mx-auto bg-[#1E1E22] border border-[#FFD700]/10 rounded-xl overflow-hidden">
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500 p-2 border-b border-gray-800">
            Debug: MemeID: {meme?.id} | Loading: {loading.toString()} | 
            Error: {error || 'none'} | 
            Price: {priceData?.price || 'N/A'}
          </div>
        )}
  
        <div className="p-4">
          {/* Top Section: Project Info and Buy Button */}
          <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            {meme?.logo && (
              <img
                src={meme.logo}
                alt={meme.projectName || ''}
                className="w-10 h-10 rounded-full bg-[#2A2A2E] object-cover"
              />
            )}
            <div>
              <h1 className="text-xl font-medium text-white">
                {meme?.projectName || ''}
              </h1>
              <p className="text-sm text-gray-400">
                {meme?.projectDetails?.network || ''}
              </p>
            </div>
          </div>

          <button
            onClick={handleBuyClick}
            disabled={loading || isButtonLoading}
            className="px-4 py-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isButtonLoading ? (
              <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              'Buy Here'
            )}
          </button>
        </div>

        {/* Middle Section: Price Information */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-400">Price</div>
            {loading ? (
              <div className="h-6 w-24 bg-[#2A2A2E] animate-pulse rounded" />
            ) : (
              <div className="font-medium text-white">
                {formatPrice(priceData?.price || meme?.projectDetails?.price)}
              </div>
            )}
          </div>
          <div>
            <div className="text-sm text-gray-400">24h</div>
            {loading ? (
              <div className="h-6 w-20 bg-[#2A2A2E] animate-pulse rounded" />
            ) : (
              <div className={`font-medium ${
                Number(priceData?.priceChange24h || meme?.projectDetails?.priceChange24h || 0) >= 0 
                  ? 'text-[#00DC82]' 
                  : 'text-red-400'
              }`}>
                {Number(priceData?.priceChange24h || meme?.projectDetails?.priceChange24h || 0) >= 0 ? '+' : ''}
                {Number(priceData?.priceChange24h || meme?.projectDetails?.priceChange24h || 0).toFixed(2)}%
              </div>
            )}
          </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Market Cap</div>
              {loading ? (
                <div className="h-6 w-24 ml-auto bg-[#2A2A2E] animate-pulse rounded" />
              ) : (
                <div className="font-medium text-white">
                  {formatMarketCap(priceData?.marketCap || meme?.projectDetails?.marketCap)}
                </div>
              )}
            </div>
        </div>

        {/* Bottom Section: Details Button */}
        <button
          onClick={onDetailsClick}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            isDetailsOpen
              ? 'bg-[#2A2A2E] text-[#FFD700] border border-[#FFD700]/20'
              : 'bg-[#2A2A2E] text-gray-300 hover:text-white hover:bg-[#363639]'
          }`}
        >
          {isDetailsOpen ? 'Close Details' : 'View Details'}
        </button>
      </div>
    </div>
    </div>
  );
};

export default TopBar;