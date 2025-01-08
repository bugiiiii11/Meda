//TasksPage.jsx
import React, { useState, useEffect } from 'react';
import { ENDPOINTS, getHeaders } from '../config/api';

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
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L15.3 6.3C15.7 6.7 16.3 6.9 16.9 6.9H19C20.1 6.9 21 7.8 21 8.9V11C21 11.6 21.2 12.2 21.6 12.6L24 16L21.6 19.4C21.2 19.8 21 20.4 21 21V23.1C21 24.2 20.1 25.1 19 25.1H16.9C16.3 25.1 15.7 25.3 15.3 25.7L12 29L8.7 25.7C8.3 25.3 7.7 25.1 7.1 25.1H5C3.9 25.1 3 24.2 3 23.1V21C3 20.4 2.8 19.8 2.4 19.4L0 16L2.4 12.6C2.8 12.2 3 11.6 3 11V8.9C3 7.8 3.9 6.9 5 6.9H7.1C7.7 6.9 8.3 6.7 8.7 6.3L12 3Z" 
          fill="#229ED9"/>
    <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CriticalSlayerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.8 8.6L23 9.3L17.5 14.4L19 21.5L12 17.9L5 21.5L6.5 14.4L1 9.3L8.2 8.6L12 2Z" 
          fill="#1DA1F2"/>
    <path d="M12 6V14M8 10H16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const LegendaryStrikerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
          fill="#FFD700"/>
  </svg>
);

const NetworkNinjaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill="#229ED9"/>
    <circle cx="6" cy="16" r="3" fill="#229ED9"/>
    <circle cx="18" cy="16" r="3" fill="#229ED9"/>
    <path d="M12 12L6 15M12 12L18 15" stroke="#229ED9" strokeWidth="2"/>
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

const TasksPage = ({ userData, onUserDataUpdate }) => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    if (userData?.completedTasks) {
      setCompletedTasks(new Set(userData.completedTasks.map(task => task.taskId)));
    }
  }, [userData]);

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
          telegramId: userData?.telegramId
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

  const AchievementTask = ({ label, current, target, points, completed, achievementType }) => {
    // Get icon based on achievement type
    const getIcon = (type) => {
      switch (type) {
        case 'power-collector':
          return <PowerCollectorIcon />;
        case 'critical-slayer':
          return <CriticalSlayerIcon />;
        case 'legendary-striker':
          return <LegendaryStrikerIcon />;
        case 'network-ninja':
          return <NetworkNinjaIcon />;
        default:
          return <PowerCollectorIcon />;
      }
    };

    return (
      <div className="w-full p-4 rounded-xl bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] border border-white/5 relative overflow-hidden">
        {/* Achievement header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center">
              {getIcon(achievementType)}
            </div>
            <div>
              <span className="font-game-title text-white">{label}</span>
              {!completed && (
                <div className="text-sm text-[#FFD700] font-game-mono mt-1">
                  +{points} points
                </div>
              )}
            </div>
          </div>
          {completed && <CheckIcon />}
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-[#1E1E22] rounded-full overflow-hidden relative">
          <div 
            className="h-full rounded-full relative overflow-hidden transition-all duration-500 flex items-center"
            style={{ 
              width: `${Math.min((current / target) * 100, 100)}%`,
              background: 'linear-gradient(90deg, #4B7BF5, #8A2BE2)'
            }}
          >
            {/* Shine effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{ animation: 'progressShine 2s infinite' }}
            />
          </div>
        </div>

        {/* Progress numbers */}
        <div className="flex justify-between mt-2">
          <span className="font-game-mono text-[#4B7BF5]">{current.toLocaleString()}</span>
          <span className="font-game-mono text-gray-400">{target.toLocaleString()}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0B0F]">
      {/* Header */}
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
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto pt-[100px] pb-20 px-4">
        <div className="max-w-md mx-auto space-y-8">
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-game-mono">
              {error}
            </div>
          )}

          {/* Quick Tasks Section */}
          <div className="space-y-4">
            <h2 className="font-game-title text-xl text-white px-2">Quick Tasks</h2>
            <div className="space-y-2">
              {quickTasks.map((task) => (
                <TaskButton
                  key={task.id}
                  task={task}
                  completed={completedTasks.has(task.id)}
                />
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="space-y-4">
            <h2 className="font-game-title text-xl text-white px-2">Achievements</h2>
            <div className="space-y-3">
              <AchievementTask
                label="Power-Up Collector (Tier 1)"
                current={userData?.pointsBreakdown?.likes || 0}
                target={1000}
                points={1000}
                completed={completedTasks.has('achievement-likes')}
                achievementType="power-collector"
              />
              <AchievementTask
                label="Critical Slayer (Tier 1)"
                current={userData?.pointsBreakdown?.dislikes || 0}
                target={1000}
                points={1000}
                completed={completedTasks.has('achievement-dislikes')}
                achievementType="critical-slayer"
              />
              {userData?.pointsBreakdown?.superLikes >= 100 ? (
                <AchievementTask
                  label="Ultra Striker (Tier 2)"
                  current={userData?.pointsBreakdown?.superLikes || 0}
                  target={500}
                  points={5000}
                  completed={completedTasks.has('achievement-superlikes-2')}
                  achievementType="legendary-striker"
                />
              ) : (
                <AchievementTask
                  label="Legendary Striker (Tier 1)"
                  current={userData?.pointsBreakdown?.superLikes || 0}
                  target={100}
                  points={1000}
                  completed={completedTasks.has('achievement-superlikes')}
                  achievementType="legendary-striker"
                />
              )}
              <AchievementTask
                label="Network Ninja (Tier 1)"
                current={userData?.referralStats?.referredUsers?.length || 0}
                target={20}
                points={1000}
                completed={completedTasks.has('achievement-referrals')}
                achievementType="network-ninja"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;