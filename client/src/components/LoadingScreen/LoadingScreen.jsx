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
      <div className="fixed inset-0 bg-[#1a1b1e] flex flex-col items-center justify-center">
        <div className="text-red-500 text-center p-4 max-w-md">
          <h2 className="text-xl mb-2">Initialization Error</h2>
          <p className="text-sm opacity-90">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Normal loading screen
  return (
    <div className="fixed inset-0 bg-[#1a1b1e] flex flex-col">
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <img
          src="/loading.png"
          alt="Loading"
          className="loading-image w-screen animate-pulse"
          style={{
            width: '100vw',
            height: 'auto',
            maxHeight: '90vh'
          }}
          draggable="false"
          onError={(e) => {
            console.error('Loading image error:', e);
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
          }}
        />
      </div>
      <div className="w-full px-6 mb-20">
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-load-progress" />
        </div>
        <p className="text-gray-400 mt-4 text-center text-lg">Loading market data...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;