import React from 'react';

const DesktopRestriction = () => {
  return (
    <div className="fixed inset-0 bg-[#0A0B0F] flex items-center justify-center p-6">
      <div className="relative max-w-md w-full">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4B7BF5]/20 to-[#8A2BE2]/20 rounded-xl blur-xl" />
        
        {/* Content container */}
        <div className="relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] border border-[#4B7BF5]/20 
          rounded-xl p-6 text-center">
          
          {/* Mobile Phone Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 border-4 border-[#4B7BF5] rounded-xl"></div>
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#4B7BF5] rounded-full"></div>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 border-2 border-[#4B7BF5] rounded-full"></div>
            </div>
          </div>
          
          {/* Title */}
          <h2 className="font-game-title text-2xl text-white mb-4">
            Mobile Only App
          </h2>
          
          {/* Description */}
          <p className="font-game-mono text-gray-400 mb-6">
            This app is designed for mobile devices only. Please open this link on your mobile device.
          </p>
          
          {/* Additional info */}
          <p className="font-game-mono text-sm text-gray-500">
            For the best experience, please use your mobile phone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesktopRestriction;