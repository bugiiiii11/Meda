// src/components/RanksPage.jsx
import React, { useState, useEffect } from 'react';
import { ENDPOINTS } from '../config/api';

const RanksPage = () => {
  const [leaderboardData, setLeaderboardData] = useState({
    users: [],
    projects: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchLeaderboardData();
    const interval = setInterval(fetchLeaderboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      console.log('Fetching leaderboard data from:', ENDPOINTS.interactions.leaderboard);
      const response = await fetch(ENDPOINTS.interactions.leaderboard);
      
      if (!response.ok) {
        console.error('Leaderboard response not OK:', response.status);
        const text = await response.text();
        console.error('Error response:', text);
        throw new Error(`Failed to fetch leaderboard: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Received leaderboard data:', data);
      
      setLeaderboardData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1b1e]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[70]">
        <div className="w-full bg-[#1a1b1e] py-4">
          <div className="w-full px-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#2c2d31] flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="pt-[72px] px-4">
        <div className="flex rounded-lg overflow-hidden mb-4 bg-[#2c2d31]">
          <button
            className={`flex-1 py-2 px-4 ${activeTab === 'users' ? 'bg-[#3c3d41] text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`flex-1 py-2 px-4 ${activeTab === 'projects' ? 'bg-[#3c3d41] text-white' : 'text-gray-400'}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="space-y-2">
            {leaderboardData.users.map((user, index) => (
              <div
                key={user.telegramId}
                className="flex items-center gap-4 bg-[#2c2d31] p-4 rounded-lg"
              >
                <div className="w-8 flex-shrink-0 text-center">
                  <span className="text-xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{user.username}</h3>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-medium">{formatNumber(user.totalPoints)} pts</p>
                  <div className="flex gap-2 text-xs text-gray-400">
                    <span>👍 {formatNumber(user.statistics.likes)}</span>
                    <span>⭐ {formatNumber(user.statistics.superLikes)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboardData.projects.map((project, index) => (
              <div
                key={project.name}
                className="flex items-center gap-4 bg-[#2c2d31] p-4 rounded-lg"
              >
                <div className="w-8 flex-shrink-0 text-center">
                  <span className="text-xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{project.name}</h3>
                  <p className="text-xs text-gray-400">Memes: {project.memeCount}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-medium">{formatNumber(project.totalPoints)} pts</p>
                  <div className="flex gap-2 text-xs text-gray-400">
                    <span>👍 {formatNumber(project.totalLikes)}</span>
                    <span>⭐ {formatNumber(project.totalSuperLikes)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RanksPage;