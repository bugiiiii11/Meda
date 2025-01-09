import React, { useState } from 'react';

const AnimatedButton = ({ onClick, children, className }) => {
  const [isFlashing, setIsFlashing] = useState(false);

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
              <h1 className="font-game-title text-xl text-white">
                {meme?.projectName || ''}
              </h1>
              <p className="font-game-mono text-sm text-gray-400">
                Game Hub
              </p>
            </div>
          </div>

          {/* Right side - Buy Button */}
          <AnimatedButton
            onClick={handleBuyClick}
            disabled={isButtonLoading}
            className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-lg
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isButtonLoading ? (
              <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              'Buy Now'
            )}
          </AnimatedButton>
        </div>

        {/* Details Button */}
        <button
          onClick={onDetailsClick}
          className="w-full mt-3 py-3 bg-[#2A2339] rounded-lg text-white text-center"
        >
          {isDetailsOpen ? 'Close Details' : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default TopBar;