// ProjectHeader.jsx
import React, { useEffect, useState } from 'react';
import { priceService } from '../../services/priceService';

const ProjectHeader = ({ meme }) => {
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

  const handleBuyClick = () => {
    setIsButtonLoading(true);
    try {
      window.open(meme?.projectDetails?.buyLink, '_blank', 'noopener,noreferrer');
    } finally {
      setIsButtonLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    const numPrice = Number(price);
    if (isNaN(numPrice)) return '$0.00';
    if (numPrice < 0.0001) return `$${numPrice.toFixed(8)}`;
    if (numPrice < 0.01) return `$${numPrice.toFixed(6)}`;
    if (numPrice < 1) return `$${numPrice.toFixed(4)}`;
    return `$${numPrice.toFixed(2)}`;
  };

  return (
    <div className="w-full px-4 pb-4">
      <div className="max-w-md mx-auto bg-[#1E1E22] rounded-xl border border-[#FFD700]/10">
        <div className="flex items-center gap-4 p-4">
          {/* Project Icon and Name */}
          <div className="flex items-center gap-3 flex-1">
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

          {/* Buy Button */}
          <button
            onClick={handleBuyClick}
            disabled={loading || isButtonLoading}
            className="px-4 py-2 bg-[#00DC82] hover:bg-[#00DC82]/90 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isButtonLoading ? (
              <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              'Buy Here ↗'
            )}
          </button>
        </div>

        {/* Price Information */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-sm text-gray-400">Price</div>
              {loading ? (
                <div className="h-6 w-24 bg-gray-700 animate-pulse rounded" />
              ) : (
                <div className="font-medium text-white">
                  {formatPrice(priceData?.price || meme?.projectDetails?.price)}
                </div>
              )}
            </div>
            {loading ? (
              <div className="h-6 w-20 bg-gray-700 animate-pulse rounded" />
            ) : (
              priceData?.priceChange24h && (
                <div className={`px-2 py-1 rounded-lg text-sm font-medium ${
                  Number(priceData.priceChange24h) >= 0 
                    ? 'bg-[#00DC82]/10 text-[#00DC82]' 
                    : 'bg-red-500/10 text-red-400'
                }`}>
                  {Number(priceData.priceChange24h) >= 0 ? '+' : ''}
                  {Number(priceData.priceChange24h).toFixed(2)}%
                </div>
              )
            )}
          </div>
          <div>
            <div className="text-sm text-gray-400">Market Cap</div>
            {loading ? (
              <div className="h-6 w-24 bg-gray-700 animate-pulse rounded" />
            ) : (
              <div className="font-medium text-white">
                {priceData?.marketCap 
                  ? `$${Number(priceData.marketCap).toLocaleString()}`
                  : 'N/A'
                }
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="px-4 pb-4">
            <div className="text-red-400 text-sm bg-red-500/10 rounded-lg p-2">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;