//Navigation.jsx
import React from 'react';

const SwipeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 5l4 7-4 7M8 5l4 7-4 7M3 5l4 7-4 7"
    />
  </svg>
);

const TaskIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <circle
      cx="12"
      cy="12"
      r="8"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.5 12.5l2 2l5-5"
    />
  </svg>
);

const RankIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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
);

const ProfileIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
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
);

const Navigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'memes', icon: SwipeIcon, label: 'Swipe' },
    { id: 'tasks', icon: TaskIcon, label: 'Quests' },
    { id: 'ranks', icon: RankIcon, label: 'Arena' },
    { id: 'profile', icon: ProfileIcon, label: 'Hero' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient overlay for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0F] to-transparent blur-xl"></div>

      {/* Main navigation */}
      <div className="relative w-full px-4 py-3 bg-gradient-to-b from-[#2A1B3D]/90 to-[#1A1B2E]/90 
        border-t border-white/5 backdrop-blur-lg">
        <div className="max-w-md mx-auto h-full flex justify-around items-center">
          {navItems.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id;
            
            return (
              <button
                key={id}
                onClick={() => onTabChange(id)}
                className="relative group"
              >
                {/* Active indicator glow */}
                {isActive && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#4B7BF5]/20 to-[#8A2BE2]/20 
                    blur-lg rounded-full"></div>
                )}
                
                {/* Button content */}
                <div className={`relative flex flex-col items-center transition-all duration-300 
                  ${isActive ? 'transform scale-110' : 'hover:scale-105'}`}>
                  <div className="flex items-center justify-center w-7 h-7 mb-1">
                    <Icon
                      className={`w-full h-full transition-all duration-300 
                        ${isActive 
                          ? 'text-[#FFD700] animate-glow-pulse' 
                          : 'text-gray-400 group-hover:text-[#4B7BF5]'
                        }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-game-mono transition-all duration-300 
                      ${isActive 
                        ? 'text-[#FFD700]' 
                        : 'text-gray-400 group-hover:text-[#4B7BF5]'
                      }`}
                  >
                    {label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;