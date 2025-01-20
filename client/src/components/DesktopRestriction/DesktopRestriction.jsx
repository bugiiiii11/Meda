import React from 'react';

const DesktopRestriction = () => {
  return (
    <div className="fixed inset-0 bg-[#0A0B0F] flex items-center justify-center p-6">
      <div className="relative max-w-md w-full">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4B7BF5]/20 to-[#8A2BE2]/20 rounded-xl blur-xl" />
        
        {/* Content container */}
        <div className="relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] border border-[#4B7BF5]/20 rounded-xl p-6 text-center">
          {/* QR Code Image */}
          <div className="flex justify-center mb-6">
            <img 
              src="/assets/images/desktopQR.png" 
              alt="Telegram QR Code"
              className="w-48 h-48 rounded-lg"
            />
          </div>
          
          {/* Title */}
          <h2 className="font-game-title text-2xl text-white mb-4">
            Mobile App Only!
          </h2>
          
          {/* Description */}
          <p className="font-game-mono text-gray-400 mb-6">
            Scan this QR code with your mobile device to continue using the app.
          </p>

        </div>
      </div>
    </div>
  );
};

export default DesktopRestriction;