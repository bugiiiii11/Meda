// DetailsPage.jsx
import React, { useState } from 'react';

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

const DetailsPage = ({ isOpen, meme }) => {
  const baseStyles = {
    position: 'fixed',
    left: 0,
    right: 0,
    top: '240px',
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
          {/* Description Section */}
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

          {/* Contract Section */}
          {meme?.projectDetails?.contract && meme?.projectDetails?.network && (
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
          <div className="space-y-2">
            {meme?.projectDetails?.buttons?.map((button, index) => (
              <AnimatedButton
                key={index}
                onClick={() => window.open(button.url, '_blank')}
                className="w-full"
              >
                <div className="px-4 py-3 bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] 
                  text-gray-200 rounded-xl font-game-title border border-white/5 
                  hover:border-white/10 transition-colors">
                  {button.label}
                </div>
              </AnimatedButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;