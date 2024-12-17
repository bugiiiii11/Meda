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

  const handleBuyClick = () => {
    setIsButtonLoading(true);
    try {
      window.open(meme?.projectDetails?.buyLink, '_blank', 'noopener,noreferrer');
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#121214] border-y border-[#FFD700]/10">
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 p-2 border-b border-gray-800 max-w-md mx-auto">
          Debug: MemeID: {meme?.id} | Loading: {loading.toString()} | 
          Error: {error || 'none'} | 
          Price: {priceData?.price || 'N/A'}
        </div>
      )}

      <div className="max-w-md mx-auto p-4">
        <div className="flex flex-col gap-4">
          {/* Price and Network Info */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div>
                <div className="text-sm text-gray-400">Price</div>
                {loading ? (
                  <div className="h-5 w-24 bg-[#1E1E22] animate-pulse rounded" />
                ) : (
                  <div className="font-medium text-white">
                    {formatPrice(priceData?.price || meme?.projectDetails?.price)}
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm text-gray-400">24h</div>
                {loading ? (
                  <div className="h-5 w-20 bg-[#1E1E22] animate-pulse rounded" />
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
            </div>
            
            <button
              onClick={handleBuyClick}
              disabled={loading || isButtonLoading}
              className="px-4 py-2 bg-[#00DC82] hover:bg-[#00DC82]/90 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isButtonLoading ? (
                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                'Buy Here ↗'
              )}
            </button>
          </div>

          {/* Details Button */}
          <button
            onClick={onDetailsClick}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all border ${
              isDetailsOpen
                ? 'bg-[#1E1E22] border-[#FFD700]/20 text-[#FFD700]'
                : 'bg-[#1E1E22] border-[#FFD700]/10 text-gray-300 hover:border-[#FFD700]/30'
            }`}
          >
            {isDetailsOpen ? '✕ Close Details' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;