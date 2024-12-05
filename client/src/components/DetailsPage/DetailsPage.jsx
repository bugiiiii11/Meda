import React from 'react';

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

const DetailsPage = ({ isOpen, meme }) => {
  return (
    <div
      className={`fixed left-0 right-0 bg-[#1a1b1e] z-50 transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-[-120%]'
      }`}
      style={{
        top: '180px', // Increased to not cover buttons
        bottom: '60px',
        backgroundColor: '#1a1b1e',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="max-w-md mx-auto p-4 h-full">
        <div className="flex flex-col gap-4">
          {/* Contract Information */}
          <div className="bg-[#2c2d31] rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-2 text-center">Contract</div>
            <div className="flex items-center gap-2 bg-[#1a1b1e] rounded px-3 py-2">
              <div className="text-gray-200 text-sm truncate flex-1">
                {meme?.projectDetails?.contract || 'N/A'}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(meme?.projectDetails?.contract || '')}
                className="text-gray-400 hover:text-white transition-colors p-1"
                title="Copy contract address"
              >
                <CopyIcon />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={() => window.open(meme?.projectDetails?.website || '#', '_blank')}
            className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
          >
            Website
          </button>
          
          <button
            onClick={() => window.open(meme?.projectDetails?.priceChart || '#', '_blank')}
            className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
          >
            Price Chart
          </button>

          <button
            onClick={() => window.open(meme?.projectDetails?.telegramUrl || '#', '_blank')}
            className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
          >
            Join Telegram Chat
          </button>

          <button
            onClick={() => window.open(meme?.projectDetails?.twitterUrl || '#', '_blank')}
            className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
          >
            Join Twitter
          </button>

          <button
            onClick={() => window.open(meme?.projectDetails?.instagramUrl || '#', '_blank')}
            className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
          >
            Join Instagram
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;