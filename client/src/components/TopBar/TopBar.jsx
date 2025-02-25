import React, { useState } from 'react';

const AnimatedButton = ({ onClick, children, className, disabled }) => {
  const [isFlashing, setIsFlashing] = useState(false);

  const handleClick = async () => {
    if (!isFlashing && !disabled) {
      setIsFlashing(true);
      onClick?.();
      setTimeout(() => setIsFlashing(false), 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative transform transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className="relative z-10 w-full h-full">{children}</div>
      {isFlashing && (
        <div
          className="absolute inset-0 bg-[#FFD700] rounded-lg"
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
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleBuyClick = () => {
    setIsButtonLoading(true);
    try {
      window.open(meme?.projectDetails?.buyLink, '_blank', 'noopener,noreferrer');
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-[#2A1B3D] to-[#1A1B2E] rounded-b-xl">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left side - Project Info */}
          <div className="flex items-center gap-3">
            {meme?.logo && (
              <img
                src={meme.logo}
                alt={meme.projectName || ''}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="font-game-title text-xl bg-gradient-to-r from-[#4B7BF5] to-[#8A2BE2] text-transparent bg-clip-text">
                {meme?.projectName || ''}
              </h1>
              <p className="font-game-mono text-sm text-gray-400">
                {meme?.projectDetails?.projectType || 'Telegram App'}
              </p>
            </div>
          </div>

          {/* Right side - Buy Button - Only show if project has token */}
          {meme?.projectDetails?.hasToken && meme?.projectDetails?.buyLink && (
            <AnimatedButton
              onClick={handleBuyClick}
              disabled={isButtonLoading}
              className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-game-title
                rounded-lg shadow-lg shadow-[#FFD700]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isButtonLoading ? (
                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                'Buy Now'
              )}
            </AnimatedButton>
          )}
        </div>

        {/* Details Button - Fixed height to prevent size change */}
        <button
          onClick={onDetailsClick}
          className={`w-full h-[48px] mt-3 rounded-lg font-game-title transition-all duration-300
            ${isDetailsOpen
              ? 'bg-gradient-to-r from-[#4B7BF5] to-[#8A2BE2] text-white'
              : 'bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] text-white hover:text-white'
            }
            ${!isDetailsOpen ? 'border border-white/5' : ''}`}
          style={{ boxSizing: 'border-box' }}
        >
          {isDetailsOpen ? 'Close Details' : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default TopBar;