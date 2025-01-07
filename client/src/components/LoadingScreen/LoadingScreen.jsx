// src/components/LoadingScreen/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = ({ error }) => {
  React.useEffect(() => {
    const img = document.querySelector('.loading-image');
    if (img) {
      console.log('Image dimensions:', {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        clientWidth: img.clientWidth,
        clientHeight: img.clientHeight,
        offsetWidth: img.offsetWidth,
        offsetHeight: img.offsetHeight
      });
    }
  }, []);

  // If there's an error, show error screen
  if (error) {
    return (
      <div className="fixed inset-0 bg-[#0A0B0F] flex flex-col items-center justify-center">
        <div className="relative">
          {/* Error glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5555]/20 to-[#CC4444]/20 rounded-xl blur-xl"></div>
          {/* Error content */}
          <div className="relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] border border-[#FF5555]/20 rounded-xl p-6 text-center max-w-md">
            <h2 className="font-game-title text-2xl text-[#FF5555] mb-3">Battle System Error</h2>
            <p className="font-game-mono text-gray-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-[#FF5555] to-[#CC4444] rounded-lg font-game-title text-white shadow-lg shadow-[#FF5555]/20 transform transition-all duration-300 hover:scale-105"
            >
              Recharge System
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal loading screen
  return (
    <div className="fixed inset-0 bg-[#0A0B0F] flex flex-col">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#4B7BF5] rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Main content - removed animate-pulse class */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        <img
          src="/loading.png"
          alt="Loading"
          className="loading-image w-screen"
          style={{
            width: '100vw',
            height: 'auto',
            maxHeight: '90vh',
            opacity: 1,
            filter: 'none'
          }}
          draggable="false"
          onError={(e) => {
            console.error('Loading image error:', e);
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
          }}
        />
      </div>

      {/* Loading bar section */}
      <div className="relative w-full px-6 mb-20">
        <div className="w-full h-3 bg-[#1A1B2E] rounded-full overflow-hidden border border-white/5">
          {/* Loading bar with shine effect */}
          <div className="relative h-full bg-gradient-to-r from-[#4B7BF5] to-[#8A2BE2] animate-load-progress">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-progress-shine"></div>
          </div>
        </div>
        <p className="font-game-mono text-gray-400 mt-4 text-center">
          Initializing Battle System...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;