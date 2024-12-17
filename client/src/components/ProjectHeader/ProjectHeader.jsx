// ProjectHeader.jsx
import React from 'react';

const ProjectHeader = ({ meme }) => {
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
            onClick={() => window.open(meme?.projectDetails?.buyLink, '_blank')}
            className="px-4 py-2 bg-[#00DC82] hover:bg-[#00DC82]/90 text-black font-medium rounded-lg transition-colors"
          >
            Buy Here ↗
          </button>
        </div>

        {/* Price Information */}
        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-sm text-gray-400">Price</div>
              <div className="font-medium text-white">
                {formatPrice(meme?.projectDetails?.price)}
              </div>
            </div>
            {meme?.projectDetails?.priceChange24h && (
              <div className={`px-2 py-1 rounded-lg text-sm font-medium ${
                Number(meme.projectDetails.priceChange24h) >= 0 
                  ? 'bg-[#00DC82]/10 text-[#00DC82]' 
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {Number(meme.projectDetails.priceChange24h) >= 0 ? '+' : ''}
                {meme.projectDetails.priceChange24h}%
              </div>
            )}
          </div>
          <div>
            <div className="text-sm text-gray-400">Market Cap</div>
            <div className="font-medium text-white">
              {meme?.projectDetails?.marketCap 
                ? `$${Number(meme.projectDetails.marketCap).toLocaleString()}`
                : 'N/A'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;