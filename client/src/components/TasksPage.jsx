//TasksPage.jsx
import React, { useState, useEffect } from 'react';
import { ENDPOINTS, getHeaders } from '../config/api';

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

const TasksPage = ({ userData, onUserDataUpdate }) => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const quickTasks = [
    { 
      id: 'website', 
      label: 'Browse Our Web', 
      link: 'https://cryptomeme.me', 
      points: 10
    },
    { 
      id: 'telegram', 
      label: 'Join Telegram Chat', 
      link: 'https://t.me/fynderapp', 
      points: 10
    },
    { 
      id: 'twitter', 
      label: 'Follow X', 
      link: 'https://x.com/fynderapp', 
      points: 10
    },
    { 
      id: 'instagram', 
      label: 'Follow Instagram', 
      link: 'https://instagram.com/fynderapp', 
      points: 10
    },
    { 
      id: 'news-1', 
      label: 'Read the Latest News', 
      link: 'https://x.com/bitcoinlfgo/status/1868172844129235110', 
      points: 10
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

  const TaskButton = ({ task, completed }) => {
    const [isFlashing, setIsFlashing] = React.useState(false);
  
    const handleClick = async () => {
      if (!isFlashing) {
        setIsFlashing(true);
        
        if (task.link) {
          window.open(task.link, '_blank');
        }
        if (!completed) {
          await handleTaskCompletion(task.id);
        }
  
        setTimeout(() => {
          setIsFlashing(false);
        }, 300);
      }
    };
  
    return (
      <button
        onClick={handleClick}
        className={`
          w-full p-4 rounded-xl border transition-colors relative overflow-hidden
          ${completed
            ? 'bg-[#1E1E22] border-[#FFD700]/20 text-[#FFD700]'
            : 'bg-[#1E1E22] border-[#FFD700]/10 text-gray-300 hover:border-[#FFD700]/30'
          }
        `}
      >
        <div className="relative z-10 flex items-center justify-between">
          <span className="font-medium">{task.label}</span>
          <div className="flex items-center gap-2">
            {!completed && (
              <span className="text-[#FFD700] font-serif">+{task.points}</span>
            )}
            {completed && <CheckIcon />}
          </div>
        </div>
        {/* Flash overlay - moved outside the condition */}
        {isFlashing && (
          <div 
            className="absolute inset-0 bg-[#FFD700] animate-flash"
            style={{ opacity: 0.3 }}
          />
        )}
      </button>
    );
  };

  const AchievementTask = ({ label, current, target, points, completed, taskId }) => (
    <div className={`w-full p-4 rounded-xl border ${
      completed ? 'border-[#FFD700]/20' : 'border-[#FFD700]/10'
    } bg-[#1E1E22]`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-300 font-medium">{label}</span>
        </div>
        {!completed && <span className="text-[#FFD700] font-serif">+{points}</span>}
        {completed && <CheckIcon className="text-[#FFD700]" />}
      </div>
      <div className="w-full bg-[#2A2A2E] rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-[#FFD700] transition-all duration-500"
          style={{ width: `${Math.min((current / target) * 100, 100)}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <span className="text-[#FFD700] font-serif">{current.toLocaleString()}</span>
        <span className="text-gray-400">{target.toLocaleString()}</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#121214]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#121214]">
        <div className="w-full py-6 border-b border-[#FFD700]/10">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-white">Challenges</h1>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto pt-[100px] pb-20 px-4">
        <div className="max-w-md mx-auto">
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Quick Tasks Section */}
            <div>
              <h2 className="text-lg font-medium text-white mb-3">Quick Tasks</h2>
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
            <div>
              <h2 className="text-lg font-medium text-white mb-3">Achievements</h2>
              <div className="space-y-3">
                <AchievementTask
                  label="Like Collector (Tier 1)"
                  current={userData?.pointsBreakdown?.likes || 0}
                  target={1000}
                  points={1000}
                  completed={completedTasks.has('achievement-likes')}
                  taskId="achievement-likes"
                />
                <AchievementTask
                  label="Hater Slayer (Tier 1)"
                  current={userData?.pointsBreakdown?.dislikes || 0}
                  target={1000}
                  points={1000}
                  completed={completedTasks.has('achievement-dislikes')}
                  taskId="achievement-dislikes"
                />
                {userData?.pointsBreakdown?.superLikes >= 100 ? (
                  <AchievementTask
                    label="Super Swiper (Tier 2)"
                    current={userData?.pointsBreakdown?.superLikes || 0}
                    target={500}
                    points={5000}
                    completed={completedTasks.has('achievement-superlikes-2')}
                    taskId="achievement-superlikes-2"
                  />
                ) : (
                  <AchievementTask
                    label="Super Swiper (Tier 1)"
                    current={userData?.pointsBreakdown?.superLikes || 0}
                    target={100}
                    points={1000}
                    completed={completedTasks.has('achievement-superlikes')}
                    taskId="achievement-superlikes"
                  />
                )}
                <AchievementTask
                  label="Network Ninja (Tier 1)"
                  current={userData?.referralStats?.referredUsers?.length || 0}
                  target={20}
                  points={1000}
                  completed={completedTasks.has('achievement-referrals')}
                  taskId="achievement-referrals"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;