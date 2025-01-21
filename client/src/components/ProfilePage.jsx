//ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { ENDPOINTS, getHeaders } from '../config/api';

const TabButton = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 px-4 rounded-lg font-game-title transition-all duration-300 transform hover:scale-105 
      ${isActive 
        ? 'bg-gradient-to-r from-[#4B7BF5] to-[#8A2BE2] text-white' 
        : 'bg-[#1E1E2E] text-white hover:text-white'
      }`}
  >
    {children}
  </button>
);

const StatCard = ({ icon, label, value, subtitle }) => (
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-r from-[#4B7BF5]/5 to-[#8A2BE2]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
    <div className="relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] rounded-xl p-4 border border-white/5 
      transform transition-all duration-300 hover:scale-[1.02] hover:border-white/10">
      <div className="flex items-center gap-4">
        <div className="w-12 flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-game-title text-white">{label}</h3>
          {subtitle && (
            <p className="font-game-mono text-gray-400 text-sm">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center">
          <span className="font-game-title text-[#FFD700] text-lg animate-glow-pulse">
            {value}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const ProfilePage = ({ userData: initialUserData, superlikeStatus, onUserDataUpdate }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [shareStatus, setShareStatus] = useState('');
  const [localUserData, setLocalUserData] = useState(initialUserData);

  // Function to fetch latest user data
  const fetchUserData = async () => {
    if (!initialUserData?.telegramId) return;
    
    try {
      const response = await fetch(
        ENDPOINTS.users.get(initialUserData.telegramId),
        { headers: getHeaders() }
      );
      
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      if (data.success) {
        setLocalUserData(data.data);
        if (onUserDataUpdate) onUserDataUpdate();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    const interval = setInterval(fetchUserData, 30000);
    return () => clearInterval(interval);
  }, [initialUserData?.telegramId]);

  useEffect(() => {
    setLocalUserData(initialUserData);
  }, [initialUserData]);

  const handleShare = async () => {
    if (!localUserData?.telegramId) return;
    const referralLink = `https://t.me/MedaPortalBot?start=${localUserData.telegramId}`;
    const welcomeMessage = `🎮 Join me on Meda Portal and discover exciting blockchain gaming projects! ${referralLink}`;
    
    try {
      await navigator.clipboard.writeText(welcomeMessage);
      setShareStatus('✨ Invite Link Copied!');
      
      if (window.Telegram?.WebApp) {
        try {
          window.Telegram.WebApp.switchInlineQuery(welcomeMessage);
        } catch (telegramError) {
          console.log('Telegram share fallback');
          window.location.href = 'tg://msg';
        }
      }
      
      setTimeout(() => setShareStatus(''), 2000);
    } catch (error) {
      console.error('Share error:', error);
      setShareStatus('❌ Error');
      setTimeout(() => setShareStatus(''), 2000);
    }
  };

  const renderMyStats = () => (
    <div className="space-y-3">
      <StatCard 
        icon="🔮" 
        label="Meda Energy" 
        value={localUserData?.totalPoints || 0}
      />
      <StatCard 
        icon="⚡" 
        label="Power Ups" 
        value={localUserData?.pointsBreakdown?.likes || 0} 
      />
      <StatCard 
        icon="⛔" 
        label="Criticals" 
        value={localUserData?.pointsBreakdown?.dislikes || 0} 
      />
      <StatCard 
        icon="⭐" 
        label="Strikes" 
        value={(localUserData?.pointsBreakdown?.superLikes || 0) * 3} 
      />
      <StatCard 
        icon="✅" 
        label="Quests Completed" 
        value={localUserData?.pointsBreakdown?.tasks || 0} 
      />
      <StatCard 
        icon="🎖️" 
        label="Achievements" 
        value={localUserData?.pointsBreakdown?.achievements || 0}
      />
      <StatCard 
        icon="🏰" 
        label="Alliance Bonus" 
        value={localUserData?.pointsBreakdown?.referrals || 0} 
      />
      <StatCard 
        icon="⭐" 
        label="Strikes Available" 
        value={superlikeStatus?.remainingSuperlikes || 0}
        subtitle={superlikeStatus?.nextResetIn ? `Recharge in ${superlikeStatus.nextResetIn}h` : undefined}
      />
    </div>
  );

  const renderAllianceProgram = () => (
    <div className="space-y-3">
      <div className="relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] rounded-xl p-4 border border-white/5">
        <p className="font-game-body text-white">
          Invite friends into the Meda Portal and earn 20 power points for recruited Meda Warriors!
        </p>
      </div>
      
      <button
        onClick={handleShare}
        disabled={!localUserData?.telegramId}
        className={`w-full px-4 py-3 rounded-lg font-game-title transition-all duration-300 transform hover:scale-105
          ${shareStatus 
            ? 'bg-gradient-to-r from-[#4B7BF5]/20 to-[#8A2BE2]/20 text-[#FFD700]' 
            : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {shareStatus || 'Recruit Warriors'}
      </button>

      <StatCard 
        icon="👥" 
        label="Recruited Warriors" 
        value={localUserData?.referralStats?.referredUsers?.length || 0}
      />
    </div>
  );

  if (!localUserData) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0A0B0F]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4B7BF5] border-t-transparent 
          shadow-lg shadow-[#4B7BF5]/20"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0B0F]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0F] via-[#0A0B0F]/95 to-transparent backdrop-blur-xl"></div>
        <div className="relative w-full py-6">
          <div className="text-center mb-4">
            <h1 className="font-game-title text-3xl bg-gradient-to-r from-[#4B7BF5] to-[#8A2BE2] text-transparent bg-clip-text">
              @{localUserData?.username || 'Anonymous'}
            </h1>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex gap-2 max-w-md mx-auto">
            <TabButton 
              isActive={activeTab === 'stats'} 
              onClick={() => setActiveTab('stats')}
            >
              My Stats
            </TabButton>
            <TabButton 
              isActive={activeTab === 'alliance'} 
              onClick={() => setActiveTab('alliance')}
            >
              Alliance
            </TabButton>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pt-[180px] pb-20 px-4">
        <div className="max-w-md mx-auto">
          {activeTab === 'stats' && renderMyStats()}
          {activeTab === 'alliance' && renderAllianceProgram()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;