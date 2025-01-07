//TopBar.jsx
import React, { useEffect, useState } from 'react';
import { priceService } from '../../services/priceService';

const AnimatedButton = ({ onClick, children, className }) => {
  const [isFlashing, setIsFlashing] = React.useState(false);

  const handleClick = async () => {
    if (!isFlashing) {
      setIsFlashing(true);
      onClick?.();
      setTimeout(() => setIsFlashing(false), 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative transform transition-all duration-300 hover:scale-105 ${className}`}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#4B7BF5]/10 to-[#8A2BE2]/10 rounded-xl blur-xl"></div>
      
      {/* Main content */}
      <div className="relative z-10 w-full h-full">{children}</div>
      
      {/* Flash effect */}
      {isFlashing && (
        <div 
          className="absolute inset-0 bg-[#FFD700] rounded-xl"
          style={{
            opacity: 0.3,
            animation: 'flashAnimation 0.3s ease-out forwards'
          }}
        />
      )}
    </button>
  );
};

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
      <div className="max-w-md mx-auto relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4B7BF5]/5 to-[#8A2BE2]/5 rounded-xl blur-lg"></div>
        
        {/* Main content */}
        <div className="relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] rounded-xl overflow-hidden border border-white/5">
          <div className="p-4 space-y-4">
            {/* Project Info and Buy Button */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {meme?.logo && (
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4B7BF5]/30 to-[#8A2BE2]/30 rounded-full blur-md"></div>
                    <img
                      src={meme.logo}
                      alt={meme.projectName || ''}
                      className="relative w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                  </div>
                )}
                <div>
                  <h1 className="font-game-title text-xl text-white">
                    {meme?.projectName || ''}
                  </h1>
                  <p className="font-game-mono text-sm text-gray-400">
                    {meme?.projectDetails?.projectType || ''}
                  </p>
                </div>
              </div>

              <AnimatedButton
                onClick={handleBuyClick}
                disabled={loading || isButtonLoading}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black 
                  font-game-title rounded-lg shadow-lg shadow-[#FFD700]/20 
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isButtonLoading ? (
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Buy Now'
                )}
              </AnimatedButton>
            </div>

            {/* Price Information */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: 'Price',
                  value: formatPrice(priceData?.price || meme?.projectDetails?.price),
                  loading
                },
                {
                  label: '24h',
                  value: `${Number(priceData?.priceChange24h || meme?.projectDetails?.priceChange24h || 0) >= 0 ? '+' : ''}${Number(priceData?.priceChange24h || meme?.projectDetails?.priceChange24h || 0).toFixed(2)}%`,
                  loading,
                  isChange: true
                },
                {
                  label: 'Market Cap',
                  value: formatMarketCap(priceData?.marketCap || meme?.projectDetails?.marketCap),
                  loading,
                  align: 'text-right'
                }
              ].map((item, index) => (
                <div key={index} className={item.align || ''}>
                  <div className="font-game-mono text-sm text-gray-400">{item.label}</div>
                  {item.loading ? (
                    <div className="h-6 w-24 bg-white/5 animate-pulse rounded" />
                  ) : (
                    <div className={`font-game-mono font-medium ${
                      item.isChange
                        ? Number(priceData?.priceChange24h || meme?.projectDetails?.priceChange24h || 0) >= 0
                          ? 'text-[#50FA7B]'
                          : 'text-[#FF5555]'
                        : 'text-white'
                    }`}>
                      {item.value}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Details Button */}
            <AnimatedButton
              onClick={onDetailsClick}
              className={`w-full rounded-lg font-game-title transition-all ${
                isDetailsOpen
                  ? 'bg-gradient-to-r from-[#4B7BF5]/20 to-[#8A2BE2]/20 text-[#FFD700] border border-[#FFD700]/20'
                  : 'bg-gradient-to-r from-[#1E1E22] to-[#2A2A2E] text-gray-300 border border-white/5 hover:border-white/10'
              }`}
            >
              <div className="py-3 px-4">
                {isDetailsOpen ? 'Close Details' : 'View Details'}
              </div>
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;