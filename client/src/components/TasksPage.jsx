import React, { useState, useEffect } from 'react';
import { ENDPOINTS, getHeaders } from '../config/api';

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const TaskButton = ({ onClick, completed, children, link }) => {
  const handleClick = async () => {
    if (link) {
      window.open(link, '_blank');
    }
    if (!completed) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full px-4 py-3 rounded-lg text-base font-medium transition-all flex items-center justify-between ${
        completed
          ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
          : 'bg-[#2c2d31] text-gray-200 hover:bg-[#3c3d41]'
      }`}
    >
      <span>{children}</span>
      {completed && <CheckIcon />}
    </button>
  );
};

const AchievementTask = ({ label, current, target, points, completed, onClick }) => (
  <div className={`w-full p-4 rounded-lg ${
    completed ? 'bg-green-600/20' : 'bg-[#2c2d31]'
  }`}>
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-200">{label}</span>
      {!completed && <span className="text-green-400">+{points}</span>}
      {completed && <CheckIcon />}
    </div>
    <div className="w-full bg-[#1a1b1e] rounded-full h-2">
      <div 
        className="bg-green-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min((current / target) * 100, 100)}%` }}
      />
    </div>
    <div className="flex justify-between items-center mt-1">
      <span className="text-sm text-gray-400">{current.toLocaleString()}</span>
      <span className="text-sm text-gray-400">{target.toLocaleString()}</span>
    </div>
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
      link: 'https://t.me/pumpme_me', 
      points: 10
    },
    { 
      id: 'twitter', 
      label: 'Follow X', 
      link: 'https://x.com/pumpme_me', 
      points: 10
    },
    { 
      id: 'instagram', 
      label: 'Follow Instagram', 
      link: 'https://instagram.com/pumpme_me', 
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
        console.log('Task completion response:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Failed to complete task');
        }

        if (data.success) {
            setCompletedTasks(prev => new Set([...prev, taskId]));
            
            // Update the parent component's userData
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

  return (
    <div className="w-full">
      <div className="fixed top-0 left-0 right-0 z-[70]">
        <div className="w-full bg-[#1a1b1e] py-4">
          <div className="w-full px-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#2c2d31] flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                Challenges
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[72px] pb-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-500/20 text-red-400 p-4 rounded-lg">
                {error}
              </div>
            )}
            
            {/* Quick Tasks Section */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Quick Tasks</h2>
              <div className="flex flex-col gap-4">
                {quickTasks.map((task) => (
                  <TaskButton
                    key={task.id}
                    completed={completedTasks.has(task.id)}
                    onClick={() => handleTaskCompletion(task.id)}
                    link={task.link}
                  >
                    {task.label} {!completedTasks.has(task.id) && 
                      <span className="text-green-400">+{task.points}</span>
                    }
                  </TaskButton>
                ))}
              </div>
            </div>

            {/* Achievement Tasks Section */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Achievements</h2>
              <div className="flex flex-col gap-4">
                <AchievementTask
                  label="Give Likes (Tier 1)"
                  current={userData?.pointsBreakdown?.likes || 0}
                  target={1000}
                  points={1000}
                  completed={completedTasks.has('achievement-likes')}
                  onClick={() => handleTaskCompletion('achievement-likes')}
                />
                <AchievementTask
                  label="Give Dislikes (Tier 1)"
                  current={userData?.pointsBreakdown?.dislikes || 0}
                  target={1000}
                  points={1000}
                  completed={completedTasks.has('achievement-dislikes')}
                  onClick={() => handleTaskCompletion('achievement-dislikes')}
                />
                {userData?.pointsBreakdown?.superLikes >= 100 ? (
                  <AchievementTask
                    label="Give Super Likes (Tier 2)"
                    current={userData?.pointsBreakdown?.superLikes || 0}
                    target={500}
                    points={5000}
                    completed={completedTasks.has('achievement-superlikes-2')}
                    onClick={() => handleTaskCompletion('achievement-superlikes-2')}
                  />
                ) : (
                  <AchievementTask
                    label="Give Super Likes (Tier 1)"
                    current={userData?.pointsBreakdown?.superLikes || 0}
                    target={100}
                    points={1000}
                    completed={completedTasks.has('achievement-superlikes')}
                    onClick={() => handleTaskCompletion('achievement-superlikes')}
                  />
                )}
                <AchievementTask
                  label="Invite Friends (Tier 1)"
                  current={userData?.referralStats?.referredUsers?.length || 0}
                  target={20}
                  points={1000}
                  completed={completedTasks.has('achievement-referrals')}
                  onClick={() => handleTaskCompletion('achievement-referrals')}
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