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
        return <div className="relative">
          <span className="text-3xl">👑</span>
          <div className="absolute inset-0 animate-glow-pulse"></div>
        </div>;
      case 1:
        return <span className="text-2xl">🥈</span>;
      case 2:
        return <span className="text-2xl">🥉</span>;
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] 
            flex items-center justify-center border border-white/10">
            <span className="font-game-mono text-gray-400 text-sm">#{index + 1}</span>
          </div>
        );
    }
  };

  const TabButton = ({ isActive, onClick, children }) => (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 rounded-lg font-game-title transition-all duration-300 transform hover:scale-105 
        ${isActive 
          ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black shadow-lg shadow-[#FFD700]/20' 
          : 'bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] text-gray-400 hover:text-white border border-white/5'
        }`}
    >
      {children}
    </button>
  );

  const RankCard = ({ rank, name, points }) => (
    <div className="group relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#4B7BF5]/5 to-[#8A2BE2]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
      
      {/* Card content */}
      <div className="relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] rounded-xl p-4 border border-white/5 
        transform transition-all duration-300 hover:scale-[1.02] hover:border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 flex items-center justify-center">
            {getRankIcon(rank)}
          </div>
          
          <div className="flex-1">
            <h3 className="font-game-title text-white">
              {name}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-game-mono text-[#FFD700] text-lg animate-glow-pulse">
              {formatNumber(points)}
            </span>
            <span className="font-game-mono text-gray-400 text-sm">pts</span>
          </div>
        </div>
      </div>
    </div>
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
                Champions Hall</h1>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="px-4 py-4 pb-6">
          <div className="flex gap-2 max-w-md mx-auto">
            <TabButton 
              isActive={activeTab === 'users'} 
              onClick={() => setActiveTab('users')}
            >
              Meda Heroes
            </TabButton>
            <TabButton 
              isActive={activeTab === 'projects'} 
              onClick={() => setActiveTab('projects')}
            >
              Games
            </TabButton>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto pt-[180px] pb-20 px-4">
        <div className="max-w-md mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4B7BF5] border-t-transparent 
                shadow-lg shadow-[#4B7BF5]/20"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTab === 'users' 
                ? leaderboardData.users.map((user, index) => (
                    <RankCard
                      key={user.telegramId}
                      rank={index}
                      name={user.username}
                      points={user.totalPoints}
                    />
                  ))
                : leaderboardData.projects.map((project, index) => (
                    <RankCard
                      key={project.name}
                      rank={index}
                      name={project.name}
                      points={project.totalPoints}
                    />
                  ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RanksPage;