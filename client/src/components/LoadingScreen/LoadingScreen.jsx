// src/components/LoadingScreen/LoadingScreen.js
import React from 'react';

// Add this component at the top of your App.js
const LoadingScreen = () => {
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