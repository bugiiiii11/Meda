import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  // Icons as separate components for better organization
  const MemeIcon = ({ className }) => (
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
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
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
    { id: 'memes', icon: MemeIcon, label: 'Memes' },
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