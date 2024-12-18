//Navigation.jsx
import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  // Updated SwipeIcon to better represent swiping motion
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
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );

  // Updated TaskIcon to represent challenges/achievements
  const TaskIcon = ({ className }) => (
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
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
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
            <Icon
              className={`h-6 w-6 mb-1 transition-all duration-300 ${
                activeTab === id
                  ? 'text-[#FFD700]'
                  : 'text-gray-400 group-hover:text-[#FFD700]/70'
              }`}
            />
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