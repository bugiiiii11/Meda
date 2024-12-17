// TopBar.jsx
import React from 'react';

const TopBar = ({ meme, onDetailsClick, isDetailsOpen }) => {
  return (
    <div className="w-full px-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={onDetailsClick}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all border ${
            isDetailsOpen
              ? 'bg-[#1E1E22] border-[#FFD700]/20 text-[#FFD700]'
              : 'bg-[#1E1E22] border-[#FFD700]/10 text-gray-300 hover:border-[#FFD700]/30'
          }`}
        >
          {isDetailsOpen ? '✕ Close Details' : 'View Details'}
        </button>
      </div>
    </div>
  );
};

export default TopBar;