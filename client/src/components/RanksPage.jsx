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

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <span className="text-[#FFD700] text-xl">👑</span>;
      case 1:
        return <span className="text-[#C0C0C0] text-xl">🥈</span>;
      case 2:
        return <span className="text-[#CD7F32] text-xl">🥉</span>;
      default:
        return <span className="text-gray-400 font-serif text-lg">#{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#121214]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#121214]">
        <div className="w-full py-6 border-b border-[#FFD700]/10">
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1E1E22] flex items-center justify-center">
              <span className="text-[#FFD700] text-2xl">🏆</span>
            </div>
            <h1 className="text-2xl font-serif text-white">Leaderboard</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-3 border-b border-[#FFD700]/10">
          <div className="flex gap-2 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-[#1E1E22] text-gray-400 hover:bg-[#2A2A2E]'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-[#FFD700] text-black'
                  : 'bg-[#1E1E22] text-gray-400 hover:bg-[#2A2A2E]'
              }`}
            >
              Projects
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-[140px] pb-20 px-4">
        <div className="max-w-md mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#FFD700] border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {activeTab === 'users' ? (
                leaderboardData.users.map((user, index) => (
                  <div
                    key={user.telegramId}
                    className="bg-[#1E1E22] rounded-xl p-4 border border-[#FFD700]/10 hover:border-[#FFD700]/20 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="w-12 flex items-center justify-center">
                        {getRankIcon(index)}
                      </div>
                      
                      {/* Username */}
                      <div className="flex-1">
                        <h3 className="text-white font-medium">
                          {user.username}
                        </h3>
                      </div>
                      
                      {/* Points */}
                      <div className="flex items-center gap-2">
                        <span className="text-[#FFD700] font-serif">
                          {formatNumber(user.totalPoints)}
                        </span>
                        <span className="text-gray-400 text-sm">pts</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                leaderboardData.projects.map((project, index) => (
                  <div
                    key={project.name}
                    className="bg-[#1E1E22] rounded-xl p-4 border border-[#FFD700]/10 hover:border-[#FFD700]/20 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="w-12 flex items-center justify-center">
                        {getRankIcon(index)}
                      </div>
                      
                      {/* Project Name */}
                      <div className="flex-1">
                        <h3 className="text-white font-medium">
                          {project.name}
                        </h3>
                      </div>
                      
                      {/* Points */}
                      <div className="flex items-center gap-2">
                        <span className="text-[#FFD700] font-serif">
                          {formatNumber(project.totalPoints)}
                        </span>
                        <span className="text-gray-400 text-sm">pts</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RanksPage;