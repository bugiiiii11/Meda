import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  // Updated SwipeIcon with triple chevron design
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

  // Updated TaskIcon with larger circle
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

  const navItems = [
    { id: 'memes', icon: SwipeIcon, label: 'Swipe' },
    { id: 'tasks', icon: TaskIcon, label: 'Tasks' },
    { id: 'ranks', icon: RankIcon, label: 'Ranks' },
    { id: 'profile', icon: ProfileIcon, label: 'Profile' }
  ];

  return (
    <div className="w-full px-4 py-3 bg-[#121214] border-t border-[#FFD700]/10 backdrop-blur-lg">
      <div className="max-w-md mx-auto h-full flex justify-around items-center">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center transition-all duration-300 group ${
              activeTab === id
                ? 'text-[#FFD700] transform scale-105'
                : 'text-gray-400'
            }`}
          >
            <div className="flex items-center justify-center w-7 h-7 mb-1">
              <Icon
                className={`w-full h-full transition-all duration-300 ${
                  activeTab === id
                    ? 'text-[#FFD700]'
                    : 'text-gray-400 group-hover:text-[#FFD700]/70'
                }`}
              />
            </div>
            <span
              className={`text-xs font-medium transition-all duration-300 ${
                activeTab === id
                  ? 'text-[#FFD700]'
                  : 'text-gray-400 group-hover:text-[#FFD700]/70'
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;