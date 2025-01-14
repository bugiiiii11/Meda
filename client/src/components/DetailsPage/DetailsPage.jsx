// DetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { priceService } from '../../services/priceService';

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const handleTelegramLink = (url) => {
  if (!url) return;
  
  const isTelegramBotLink = url.startsWith('https://t.me/') || url.startsWith('tg://');
  const hasDeepLinkingParams = url.includes('?startapp=') || url.includes('/TOD?');

  if (isTelegramBotLink) {
    if (window.Telegram?.WebApp) {
      if (hasDeepLinkingParams) {
        // For deep links, try using regular window.open first
        // This often works better for deep linking in Telegram
        window.open(url, '_blank');
      } else {
        // For regular Telegram links without parameters, use the WebApp method
        window.Telegram.WebApp.openTelegramLink(url);
      }
    } else {
      window.open(url, '_blank');
    }
  } else {
    window.open(url, '_blank');
  }
};

const AnimatedButton = ({ onClick, children, className }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = async () => {
    if (!isActive) {
      setIsActive(true);
      onClick?.();
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        setTimeout(() => setIsActive(false), 200);
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative transform transition-transform duration-200 hover:scale-105 
        ${isActive ? 'scale-95' : ''} ${className}`}
    >
      <div className="relative z-10 w-full h-full">{children}</div>
    </button>
  );
};

const CopyButton = ({ text }) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <div className={`
        absolute -top-8 left-1/2 -translate-x-1/2
        font-game-mono text-[#FFD700] text-sm
        transition-all duration-200
        ${showCopied ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
      `}>
        Copied!
      </div>
      <AnimatedButton
        onClick={handleCopy}
        className="text-gray-400 hover:text-[#FFD700] transition-colors p-1.5 rounded-md 
          hover:bg-gradient-to-r hover:from-[#4B7BF5]/10 hover:to-[#8A2BE2]/10"
      >
        <CopyIcon />
      </AnimatedButton>
    </div>
  );
};

const PriceStats = ({ priceData }) => {
    // Only render price stats if the project has a token
    if (!priceData?.hasToken) {
      return null;
    }
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
    if (typeof marketCap === 'string' && (marketCap.includes('B') || marketCap.includes('M'))) {
      return `$${marketCap}`;
    }
    const num = Number(marketCap);
    if (isNaN(num)) return '$0.00';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
    return `$${num.toLocaleString()}`;
  };

  const getPriceChangeColor = (change) => {
    const numChange = Number(change);
    if (isNaN(numChange)) return 'text-gray-400';
    return numChange >= 0 ? 'text-[#50FA7B]' : 'text-[#FF5555]';
  };

  return (
    <div className="relative">
      <div className="relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] rounded-xl p-4 
        border border-white/5">
        <div className="grid grid-cols-2 gap-3">
          {/* Price with 24h change */}
          <div>
            <div className="font-game-title text-gray-400 mb-2">Price</div>
            <div className="font-game-mono text-white flex items-baseline gap-2">
              <span>{formatPrice(priceData?.price)}</span>
              <span className={`text-sm ${
                priceData?.priceChange24h >= 0 ? 'text-[#50FA7B]' : 'text-[#FF5555]'
              }`}>
                ({priceData?.priceChange24h > 0 ? '+' : ''}
                {priceData?.priceChange24h?.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Market Cap */}
          <div className="text-right">
            <div className="font-game-title text-gray-400 mb-2">Market Cap</div>
            <div className="font-game-mono text-white">
              {formatMarketCap(priceData?.marketCap)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailsPage = ({ isOpen, meme }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchPriceData = async () => {
      if (!meme?.id) return;

      try {
        setLoading(true);
        const data = await priceService.getTokenDataByMemeId(meme.id);
        if (isMounted) {
          setPriceData(data);
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
        // Fallback to project details
        if (isMounted && meme?.projectDetails) {
          setPriceData({
            price: meme.projectDetails.price,
            marketCap: meme.projectDetails.marketCap,
            priceChange24h: meme.projectDetails.priceChange24h
          });
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
  }, [meme?.id]);

  const baseStyles = {
    position: 'fixed',
    left: 0,
    right: 0,
    top: '130px',
    bottom: '60px',
    background: '#0A0B0F',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
    opacity: isOpen ? 1 : 0,
    transition: 'transform 0.3s ease-out, opacity 0.2s ease-out',
    visibility: isOpen ? 'visible' : 'hidden',
    zIndex: 40
  };

  return (
    <div style={baseStyles}>
      <div className="max-w-md mx-auto p-4 h-full overflow-y-auto">
        <div className="space-y-4">
          {/* Only show PriceStats if project has a token */}
          {meme?.projectDetails?.hasToken && (
            <PriceStats priceData={priceData || meme?.projectDetails} />
          )}

          {/* Description Section - always show */}
          {meme?.projectDetails?.description && (
            <div className="relative">
              <div className="relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] rounded-xl p-4 
                border border-white/5">
                <div className="font-game-title text-center text-gray-400 mb-3">
                  Description
                </div>
                <div className="bg-[#1A1B2E] rounded-lg px-3 py-2 border border-white/5">
                  <div className="font-game-mono text-gray-200 text-sm text-center">
                    {meme.projectDetails.description}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contract Section - only show if project has a token */}
          {meme?.projectDetails?.hasToken && meme?.projectDetails?.contract && meme?.projectDetails?.network && (
            <div className="relative">
              <div className="relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] rounded-xl p-4 
                border border-white/5">
                <div className="font-game-title text-center text-gray-400 mb-3">
                  Contract Address On {meme.projectDetails.network}
                </div>
                <div className="flex items-center gap-2 bg-[#1A1B2E] rounded-lg px-3 py-2 border border-white/5">
                  <div className="font-game-mono text-gray-200 text-sm truncate flex-1">
                    {meme.projectDetails.contract}
                  </div>
                  <CopyButton text={meme.projectDetails.contract} />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {meme?.projectDetails?.buttons && (
            <div className="grid grid-cols-2 auto-rows-auto gap-2">
              {meme.projectDetails.buttons.map((button, index) => (
                <AnimatedButton
                  key={`button-${index}`}
                  onClick={() => handleTelegramLink(button.url)}
                  className={`w-full ${
                    index === meme.projectDetails.buttons.length - 1 && 
                    meme.projectDetails.buttons.length % 2 === 1
                      ? 'col-span-1'
                      : ''
                  }`}
                >
                  <div className="px-4 py-3 bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] 
                    text-gray-200 rounded-xl font-game-title border border-white/5 
                    hover:border-white/10 transition-colors">
                    {button.label}
                  </div>
                </AnimatedButton>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;