import React, { useState, useEffect } from 'react';
import { ENDPOINTS, getHeaders } from '../config/api';

const CopyIcon = () => (
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
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

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

const TasksPage = ({ userData }) => {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const tasks = [
    { id: 'website', label: 'Website', link: 'https://cryptomeme.me', points: 10 },
    { id: 'telegram', label: 'Join Telegram Chat', link: 'https://t.me/cryptomemebot', points: 10 },
    { id: 'twitter', label: 'Follow X', link: 'https://x.com/cryptomemebot', points: 10 },
    { id: 'instagram', label: 'Follow Instagram', link: 'https://instagram.com/cryptomemebot', points: 10 }
  ];

  useEffect(() => {
    if (userData?.completedTasks) {
      setCompletedTasks(new Set(userData.completedTasks.map(task => task.taskId)));
    }
  }, [userData]);

  const handleTaskCompletion = async (taskId) => {
    if (completedTasks.has(taskId) || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.base}/api/tasks/complete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          taskId,
          telegramId: userData.telegramId
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

      <div className="pt-[72px] px-4">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col gap-4">
            <div className="bg-[#2c2d31] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2 text-center">Invite Friends</div>
              <div className="flex items-center gap-2 bg-[#1a1b1e] rounded px-3 py-2">
                <div className="text-gray-200 text-sm truncate flex-1">
                  https://t.me/cryptomememe_bot
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://t.me/cryptomememe_bot');
                  }}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  title="Copy invite link"
                >
                  <CopyIcon />
                </button>
              </div>
            </div>

            {tasks.map((task) => (
              <TaskButton
                key={task.id}
                completed={completedTasks.has(task.id)}
                onClick={() => handleTaskCompletion(task.id)}
                link={task.link}
              >
                {task.label} {!completedTasks.has(task.id) && <span className="text-green-400">+{task.points}</span>}
              </TaskButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;