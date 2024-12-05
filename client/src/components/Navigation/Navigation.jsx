import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full px-4 py-3 bg-gradient-to-b from-[#2c2d31] to-[#1a1b1e] border-t border-[#3c3d41]/30 backdrop-blur-sm">
      <div className="max-w-md mx-auto h-full flex justify-around items-center">
        <button
          onClick={() => onTabChange('memes')}
          className={`flex flex-col items-center transition-all ${
            activeTab === 'memes'
              ? 'text-[#FF3366] scale-110 transform duration-200'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-xs mt-1 font-medium">Memes</span>
        </button>

        <button
          onClick={() => onTabChange('tasks')}
          className={`flex flex-col items-center transition-all ${
            activeTab === 'tasks'
              ? 'text-[#FF3366] scale-110 transform duration-200'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <span className="text-xs mt-1 font-medium">Tasks</span>
        </button>

        <button
          onClick={() => onTabChange('ranks')}
          className={`flex flex-col items-center transition-all ${
            activeTab === 'ranks'
              ? 'text-[#FF3366] scale-110 transform duration-200'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-xs mt-1 font-medium">Ranks</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center transition-all ${
            activeTab === 'profile'
              ? 'text-[#FF3366] scale-110 transform duration-200'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-xs mt-1 font-medium">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;