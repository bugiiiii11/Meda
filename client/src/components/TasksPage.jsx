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
      disabled={completed}
    >
      <span>{children}</span>
      {completed && <CheckIcon />}
    </button>
  );
};

const AchievementTask = ({ label, current, tiers, type }) => {
  // Find the current applicable tier
  const currentTier = tiers.find((tier, index) => {
    const previousTier = tiers[index - 1];
    const minValue = previousTier ? previousTier.target : 0;
    return current >= minValue && current < tier.target;
  }) || tiers[tiers.length - 1];

  // Find the previous completed tier
  const previousTier = tiers.find((tier, index) => {
    const nextTier = tiers[index + 1];
    return nextTier && current >= tier.target && current < nextTier.target;
  });

  const startValue = previousTier ? previousTier.target : 0;
  const progress = ((current - startValue) / (currentTier.target - startValue)) * 100;
  const isCompleted = current >= currentTier.target;

  return (
    <div className={`w-full p-4 rounded-lg ${
      isCompleted ? 'bg-green-600/20' : 'bg-[#2c2d31]'
    }`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-200">
          {label} (Tier {currentTier.level})
        </span>
        {!isCompleted && <span className="text-green-400">+{currentTier.points}</span>}
        {isCompleted && <CheckIcon />}
      </div>
      <div className="w-full bg-[#1a1b1e] rounded-full h-2">
        <div 
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1">
        <span className="text-sm text-gray-400">{current.toLocaleString()}</span>
        <span className="text-sm text-gray-400">{currentTier.target.toLocaleString()}</span>
      </div>
    </div>
  );
};

const TasksPage = ({ userData }) => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [latestNewsId, setLatestNewsId] = useState(null);

  // Define achievement tiers
  const achievementConfigs = {
    likes: {
      label: 'Give Likes',
      tiers: [
        { level: 1, target: 1000, points: 1000 },
        { level: 2, target: 5000, points: 5000 },
        { level: 3, target: 25000, points: 25000 },
        { level: 4, target: 125000, points: 125000 }
      ]
    },
    dislikes: {
      label: 'Give Dislikes',
      tiers: [
        { level: 1, target: 1000, points: 1000 },
        { level: 2, target: 5000, points: 5000 },
        { level: 3, target: 25000, points: 25000 },
        { level: 4, target: 125000, points: 125000 }
      ]
    },
    superLikes: {
      label: 'Give Super Likes',
      tiers: [
        { level: 1, target: 100, points: 1000 },
        { level: 2, target: 500, points: 5000 },
        { level: 3, target: 2500, points: 25000 },
        { level: 4, target: 12500, points: 125000 }
      ]
    },
    referrals: {
      label: 'Invite Friends',
      tiers: [
        { level: 1, target: 20, points: 1000 },
        { level: 2, target: 100, points: 5000 },
        { level: 3, target: 500, points: 25000 },
        { level: 4, target: 2500, points: 125000 }
      ]
    }
  };

  const linkTasks = [
    { 
      id: 'website', 
      label: 'Browse Our Web', 
      link: 'https://cryptomeme.me', 
      points: 10,
      type: 'single'
    },
    { 
      id: 'telegram', 
      label: 'Join Telegram Chat', 
      link: 'https://t.me/pumpme_me', 
      points: 10,
      type: 'single'
    },
    { 
      id: 'twitter', 
      label: 'Follow X', 
      link: 'https://x.com/pumpme_me', 
      points: 10,
      type: 'single'
    },
    { 
      id: 'instagram', 
      label: 'Follow Instagram', 
      link: 'https://instagram.com/pumpme_me', 
      points: 10,
      type: 'single'
    },
    { 
      id: `news-${latestNewsId}`, 
      label: 'Read the Latest News', 
      link: 'https://x.com/bitcoinlfgo/status/1868172844129235110', 
      points: 10,
      type: 'repeatable'
    }
  ];
/*
  const achievementTasks = [
    {
      id: 'likes-1000',
      label: 'Give 1000 Likes',
      current: userData?.pointsBreakdown?.likes || 0,
      target: 1000,
      points: 1000,
      type: 'achievement'
    },
    {
      id: 'dislikes-1000',
      label: 'Give 1000 Dislikes',
      current: userData?.pointsBreakdown?.dislikes || 0,
      target: 1000,
      points: 1000,
      type: 'achievement'
    },
    {
      id: 'superlikes-100',
      label: 'Give 100 Super Likes',
      current: userData?.pointsBreakdown?.superLikes || 0,
      target: 100,
      points: 1000,
      type: 'achievement'
    },
    {
      id: 'referrals-20',
      label: 'Invite 20 Friends',
      current: userData?.referralStats?.referredUsers?.length || 0,
      target: 20,
      points: 1000,
      type: 'achievement'
    }
  ];
*/

  useEffect(() => {
    if (userData?.completedTasks) {
      setCompletedTasks(new Set(userData.completedTasks.map(task => task.taskId)));
    }
  }, [userData]);

  const handleTaskCompletion = async (taskId, type) => {
    if ((type === 'single' && completedTasks.has(taskId)) || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.base}/api/tasks/complete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          taskId,
          telegramId: userData.telegramId,
          taskType: type
        })
      });

      const data = await response.json();
      if (data.success) {
        setCompletedTasks(prev => new Set([...prev, taskId]));
      }
    } catch (error) {
      console.error('Error completing task:', error);
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
                Fynder's Challenges
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-[72px] pb-20 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col gap-6">
            {/* Quick Tasks Section */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">Quick Tasks</h2>
              <div className="flex flex-col gap-4">
                {linkTasks.map((task) => (
                  <TaskButton
                    key={task.id}
                    completed={task.type === 'single' ? completedTasks.has(task.id) : completedTasks.has(`news-${latestNewsId}`)}
                    onClick={() => handleTaskCompletion(task.id, task.type)}
                    link={task.link}
                  >
                    {task.label} {(!completedTasks.has(task.id) || task.type === 'repeatable') && 
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
                  label={achievementConfigs.likes.label}
                  current={userData?.pointsBreakdown?.likes || 0}
                  tiers={achievementConfigs.likes.tiers}
                  type="likes"
                />
                <AchievementTask
                  label={achievementConfigs.dislikes.label}
                  current={userData?.pointsBreakdown?.dislikes || 0}
                  tiers={achievementConfigs.dislikes.tiers}
                  type="dislikes"
                />
                <AchievementTask
                  label={achievementConfigs.superLikes.label}
                  current={userData?.pointsBreakdown?.superLikes || 0}
                  tiers={achievementConfigs.superLikes.tiers}
                  type="superLikes"
                />
                <AchievementTask
                  label={achievementConfigs.referrals.label}
                  current={userData?.referralStats?.referredUsers?.length || 0}
                  tiers={achievementConfigs.referrals.tiers}
                  type="referrals"
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