//TasksPage.jsx
import React, { useState, useEffect } from 'react';
import { ENDPOINTS, getHeaders } from '../config/api';
import CongratulationsModal from './modals/CongratulationsModal';

// Custom Icon Components
const TelegramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701l-.321 4.796c.47 0 .678-.216.94-.47l2.26-2.196l4.696 3.466c.866.477 1.489.232 1.706-.803l3.098-14.59c.317-1.269-.485-1.843-1.557-1.37z" 
          fill="#229ED9"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568 4.692 4.692 0 0 1-2.104.08 4.661 4.661 0 0 0 4.352 3.234 9.348 9.348 0 0 1-5.786 1.995 9.5 9.5 0 0 1-1.112-.065 13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41z" 
          fill="#1DA1F2"/>
  </svg>
);

// Achievement Icon Components
const PowerCollectorIcon = () => (
  <div className="w-12 h-12 flex items-center justify-center text-4xl">
    ⚡
  </div>
);

const CriticalSlayerIcon = () => (
  <div className="w-12 h-12 flex items-center justify-center text-4xl">
    ⛔
  </div>
);

const LegendaryStrikerIcon = () => (
  <div className="w-12 h-12 flex items-center justify-center text-4xl">
    ⭐
  </div>
);

const NetworkNinjaIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Central node */}
    <circle cx="24" cy="24" r="8" fill="#1DA1F2"/>
    {/* Outer nodes */}
    <circle cx="8" cy="24" r="4" fill="#1DA1F2"/>
    <circle cx="40" cy="24" r="4" fill="#1DA1F2"/>
    <circle cx="16" cy="12" r="4" fill="#1DA1F2"/>
    <circle cx="32" cy="12" r="4" fill="#1DA1F2"/>
    <circle cx="16" cy="36" r="4" fill="#1DA1F2"/>
    <circle cx="32" cy="36" r="4" fill="#1DA1F2"/>
    {/* Connection lines */}
    <path d="M12 24L20 24M28 24L36 24M18 14L22 20M30 14L26 20M18 34L22 28M30 34L26 28" 
          stroke="#1DA1F2" strokeWidth="2.5"/>
  </svg>
);

const CheckIcon = () => (
  <div className="bg-[#FFD700] rounded-full p-1.5 flex items-center justify-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-black"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  </div>
);

// Fixed AnimatedButton component
const AnimatedButton = ({ onClick, children, className }) => {
  const [isFlashing, setIsFlashing] = React.useState(false);

  const handleClick = async () => {
    if (!isFlashing) {
      setIsFlashing(true);
      onClick?.();
      setTimeout(() => {
        setIsFlashing(false);
      }, 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative ${className}`}
    >
      {/* Background and content container */}
      <div className="relative z-10 w-full h-full bg-[#1E1E22] rounded-xl">
        {children}
      </div>
      
      {/* Flash overlay */}
      {isFlashing && (
        <div 
          className="absolute inset-0 bg-[#FFD700] rounded-xl"
          style={{
            opacity: 0.3,
            animation: 'flashAnimation 0.3s ease-out forwards',
            zIndex: 20
          }}
        />
      )}
    </button>
  );
};
const TasksPage = ({ userData: initialUserData, onUserDataUpdate }) => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('quick');
  const [localUserData, setLocalUserData] = useState(initialUserData);
  const [achievementTiers, setAchievementTiers] = useState(null);

  // Function to fetch latest user data
  const fetchUserData = async () => {
    if (!initialUserData?.telegramId) return;
    
    try {
      const response = await fetch(
        `${ENDPOINTS.users.get(initialUserData.telegramId)}`,
        { headers: getHeaders() }
      );
      
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      if (data.success) {
        setLocalUserData(data.data);
        // Notify parent component
        if (onUserDataUpdate) onUserDataUpdate();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchAchievementTiers = async () => {
    try {
      const response = await fetch(`${ENDPOINTS.base}/api/tasks/achievement-tiers`, {
        headers: getHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch achievement tiers');
      
      const data = await response.json();
      if (data.success) {
        // Transform the data into the format the component expects
        const tiers = data.data.reduce((acc, task) => {
          if (task.type === 'achievement') {
            const category = task.category === 'likes' ? 'powerUps' :
                           task.category === 'dislikes' ? 'criticals' :
                           task.category === 'superLikes' ? 'strikes' : 'referrals';
            acc[category] = task.tiers;
          }
          return acc;
        }, {});
        setAchievementTiers(tiers);
      }
    } catch (error) {
      console.error('Error fetching achievement tiers:', error);
    }
  };

  // Set up data fetch when component mounts
  useEffect(() => {
    fetchUserData(); // Initial fetch
    fetchAchievementTiers();
  }, [initialUserData?.telegramId]);

  // Update local data when props change
  useEffect(() => {
    setLocalUserData(initialUserData);
  }, [initialUserData]);

  const quickTasks = [
    /*
    { 
      id: 'website', 
      label: 'Browse Our Web', 
      link: 'https://cryptomeda.tech', 
      points: 10
    },
    */

        /*
    { 
      id: 'instagram', 
      label: 'Follow Instagram', 
      link: 'https://instagram.com/cryptomedatech', 
      points: 10
    },
    */

    { 
      id: 'telegram', 
      label: 'Join Telegram Chat', 
      link: 'https://t.me/medaportal', 
      points: 10,
      icon: <TelegramIcon />
    },
    { 
      id: 'twitter', 
      label: 'Follow X', 
      link: 'https://x.com/cryptomedatech', 
      points: 10,
      icon: <TwitterIcon />
    },
    { 
      id: 'news-1', 
      label: 'The Latest News', 
      link: 'https://x.com/cryptomedatech/status/1867623339931680995', 
      points: 10,
      icon: <TwitterIcon />
    }
  ];

  useEffect(() => {
    if (localUserData?.completedTasks) {
      setCompletedTasks(new Set(localUserData.completedTasks.map(task => task.taskId)));
    }
  }, [localUserData]);

  const handleTaskCompletion = async (taskId) => {
    if (completedTasks.has(taskId) || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ENDPOINTS.base}/api/tasks/complete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          taskId,
          telegramId: localUserData?.telegramId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete task');
      }

      if (data.success) {
        setCompletedTasks(prev => new Set([...prev, taskId]));
        if (typeof onUserDataUpdate === 'function') {
          onUserDataUpdate(data.data.user);
        }
      }
    } catch (error) {
      console.error('Task completion error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const TaskButton = ({ task, completed }) => (
    <AnimatedButton
      onClick={async () => {
        if (task.link) window.open(task.link, '_blank');
        if (!completed) await handleTaskCompletion(task.id);
      }}
      className="w-full"
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{task.icon}</span>
          <span className="font-game-title text-white">{task.label}</span>
        </div>
        <div className="flex items-center gap-3">
          {!completed && (
            <span className="font-game-mono text-[#FFD700] text-lg">+{task.points}</span>
          )}
          {completed && <CheckIcon />}
        </div>
      </div>
    </AnimatedButton>
  );

  const AchievementTask = ({ 
    type,
    current,
    icon,
    completed,
    achievementType
  }) => {
    const [showCongrats, setShowCongrats] = useState(false);

    const getTierInfo = (value, type) => {
      if (!achievementTiers?.[type]) return null;
      return achievementTiers[type]?.find(tier => 
        value >= tier.min && value <= tier.max
      ) || achievementTiers[type]?.[achievementTiers[type].length - 1];
    };

    const currentTier = getTierInfo(current, type);
    const progress = Math.min((current - currentTier.min) / (currentTier.max - currentTier.min) * 100, 100);
  
    return (
      <>
        <div className="w-full p-4 rounded-xl bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] border border-white/5 relative overflow-hidden">
          {/* Achievement header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center text-4xl">
                {icon}
              </div>
              <div>
                <span className="font-game-title text-white">
                  {currentTier.name}
                </span>
                <div className="text-sm text-[#FFD700] font-game-mono mt-1">
                  +{currentTier.reward} points
                </div>
              </div>
            </div>
          </div>
  
          {/* Progress bar */}
          <div className="w-full h-3 bg-[#1E1E22] rounded-full overflow-hidden relative">
            <div 
              className="h-full rounded-full relative overflow-hidden transition-all duration-500 flex items-center"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #4B7BF5, #8A2BE2)'
              }}
            >
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ animation: 'progressShine 2s infinite' }}
              />
            </div>
          </div>
  
          {/* Progress numbers */}
          <div className="flex justify-between mt-2">
            <span className="font-game-mono text-[#4B7BF5]">{current.toLocaleString()}</span>
            <span className="font-game-mono text-gray-400">{currentTier.max.toLocaleString()}</span>
          </div>
        </div>
  
        <CongratulationsModal 
          isOpen={showCongrats}
          onClose={() => setShowCongrats(false)}
        />
      </>
    );
  };

  const TabButton = ({ isActive, onClick, children }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 rounded-lg font-game-title transition-all duration-300 transform hover:scale-105 
        ${isActive 
          ? 'bg-gradient-to-r from-[#4B7BF5] to-[#8A2BE2] text-white shadow-lg shadow-[#FFD700]/20' 
          : 'bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] text-white hover:text-white border border-white/5'
        }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-[#0A0B0F]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Enhanced blur overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0F] via-[#0A0B0F]/95 to-transparent backdrop-blur-xl"></div>
        
        {/* Content */}
        <div className="relative w-full py-6">
          <div className="text-center">
            <h1 className="font-game-title text-3xl bg-gradient-to-r from-[#4B7BF5] to-[#8A2BE2] text-transparent bg-clip-text">
              Challenges
            </h1>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="px-4 py-4 pb-6">
          <div className="flex gap-2 max-w-md mx-auto">
            <TabButton 
              isActive={activeTab === 'quick'} 
              onClick={() => setActiveTab('quick')}
            >
              Quick Tasks
            </TabButton>
            <TabButton 
              isActive={activeTab === 'achievements'} 
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </TabButton>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto pt-[180px] pb-20 px-4">
        <div className="max-w-md mx-auto">
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-game-mono">
              {error}
            </div>
          )}

          {/* Conditional rendering based on active tab */}
          {activeTab === 'quick' ? (
            <div className="space-y-2">
              {quickTasks.map((task) => (
                <TaskButton
                  key={task.id}
                  task={task}
                  completed={completedTasks.has(task.id)}
                />
              ))}
            </div>
          ) : activeTab === 'achievements' && !achievementTiers ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#4B7BF5] border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-3">
            <AchievementTask
              type="powerUps"
              current={localUserData?.pointsBreakdown?.likes || 0}
              icon="⚡"
              completed={completedTasks.has('achievement-likes')}
              achievementType="power-collector"
            />
            <AchievementTask
              type="criticals"
              current={localUserData?.pointsBreakdown?.dislikes || 0}
              icon="⛔"
              completed={completedTasks.has('achievement-dislikes')}
              achievementType="critical-slayer"
            />
            <AchievementTask
              type="strikes"
              current={localUserData?.pointsBreakdown?.superLikes || 0}
              icon="⭐"
              completed={completedTasks.has('achievement-superlikes')}
              achievementType="legendary-striker"
            />
            <AchievementTask
              type="referrals"
              current={localUserData?.referralStats?.referredUsers?.length || 0}
              icon={<NetworkNinjaIcon />}
              completed={completedTasks.has('achievement-referrals')}
              achievementType="network-ninja"
            />
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;