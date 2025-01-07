//TasksPage.jsx
import React, { useState, useEffect } from 'react';
import { ENDPOINTS, getHeaders } from '../config/api';

// Custom Icon Components
const TwitterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568 4.692 4.692 0 0 1-2.104.08 4.661 4.661 0 0 0 4.352 3.234 9.348 9.348 0 0 1-5.786 1.995 9.5 9.5 0 0 1-1.112-.065 13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41z" 
          fill="#2A1B3D"/>
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

// AnimatedButton component remains unchanged
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
      <div className="relative z-10 w-full h-full bg-[#2A1B3D] rounded-xl">
        {children}
      </div>
      
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
      id: 'news-2', 
      label: 'The Latest News', 
      link: 'https://x.com/cryptomedatech/status/1846620559179702758', 
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
          <div className="w-6 h-6">{task.icon}</div>
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

  const AchievementTask = ({ label, current, target, points, completed, icon = '🏆' }) => (
    <div className="w-full p-4 rounded-xl bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] border border-white/5 relative overflow-hidden">
      {/* Achievement header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
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

  return (
    <div className="flex flex-col h-screen bg-[#0A0B0F]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0F] via-[#0A0B0F]/95 to-transparent backdrop-blur-xl"></div>
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
                icon="❤️"
              />
              <AchievementTask
                label="Critical Slayer (Tier 1)"
                current={userData?.pointsBreakdown?.dislikes || 0}
                target={1000}
                points={1000}
                completed={completedTasks.has('achievement-dislikes')}
                icon="👊"
              />
              {userData?.pointsBreakdown?.superLikes >= 100 ? (
                <AchievementTask
                  label="Ultra Striker (Tier 2)"
                  current={userData?.pointsBreakdown?.superLikes || 0}
                  target={500}
                  points={5000}
                  completed={completedTasks.has('achievement-superlikes-2')}
                  icon="⚡"
                />
              ) : (
                <AchievementTask
                  label="Legendary Striker (Tier 1)"
                  current={userData?.pointsBreakdown?.superLikes || 0}
                  target={100}
                  points={1000}
                  completed={completedTasks.has('achievement-superlikes')}
                  icon="⚡"
                />
              )}
              <AchievementTask
                label="Network Ninja (Tier 1)"
                current={userData?.referralStats?.referredUsers?.length || 0}
                target={20}
                points={1000}
                completed={completedTasks.has('achievement-referrals')}
                icon="🥷"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;