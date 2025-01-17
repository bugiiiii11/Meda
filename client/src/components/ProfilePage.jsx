//ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { ENDPOINTS, getHeaders } from '../config/api';

const ProfileCard = ({ children, className = '' }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-[#4B7BF5]/5 to-[#8A2BE2]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
    <div className={`relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] rounded-xl p-6 border border-white/5 
      transition-all duration-300 hover:border-white/10 ${className}`}>
      {children}
    </div>
  </div>
);

const StatItem = ({ icon, label, value, subtitle }) => (
  <div className="relative overflow-hidden group">
    <div className="absolute inset-0 bg-gradient-to-r from-[#4B7BF5]/5 to-[#8A2BE2]/5 rounded-lg opacity-0 
      group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="p-3 rounded-lg bg-gradient-to-r from-[#1E1E22] to-[#2A2A2E] border border-white/5 
      relative transition-all duration-300 group-hover:border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-gray-300 flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="font-game-body">{label}</span>
          </span>
          {subtitle && (
            <span className="text-sm text-gray-500 ml-7 font-game-mono">{subtitle}</span>
          )}
        </div>
        <span className="font-game-mono text-[#FFD700] animate-glow-pulse">{value}</span>
      </div>
    </div>
  </div>
);

const ProfilePage = ({ userData: initialUserData, superlikeStatus, onUserDataUpdate }) => {
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
        // Notify parent component
        if (onUserDataUpdate) onUserDataUpdate();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Set up periodic refresh
  useEffect(() => {
    fetchUserData(); // Initial fetch
    const interval = setInterval(fetchUserData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [initialUserData?.telegramId]);

  // Update local data when props change
  useEffect(() => {
    setLocalUserData(initialUserData);
  }, [initialUserData]);

  const handleShare = async () => {
    if (!localUserData?.telegramId) return;

    const referralLink = `https://t.me/MedaPortalBot?start=${localUserData.telegramId}`;
    const welcomeMessage = `🎮 Join me on Meda Portal and discover exciting blockchain gaming projects! ${referralLink}`;

    try {
      await navigator.clipboard.writeText(welcomeMessage);
      setShareStatus('✨ Copied!');

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
          <div className="text-center">
            <h1 className="font-game-title text-3xl bg-gradient-to-r from-[#4B7BF5] to-[#8A2BE2] text-transparent bg-clip-text">
              Battle Profile
            </h1>
            <p className="font-game-mono text-gray-400 text-sm mt-1">@{localUserData?.username || 'Anonymous'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto pt-[100px] pb-20 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <ProfileCard>
            <h3 className="font-game-title text-xl text-white mb-4">Combat Stats</h3>
            <div className="space-y-3">
              <StatItem 
                icon="⚡" 
                label="Total Power" 
                value={localUserData?.totalPoints || 0} 
              />
              <StatItem 
                icon="👥" 
                label="Recruited Warriors" 
                value={localUserData?.referralStats?.referredUsers?.length || 0} 
              />
              <StatItem 
                icon="⭐" 
                label="Strikes Available" 
                value={superlikeStatus?.remainingSuperlikes || 0}
                subtitle={superlikeStatus?.nextResetIn ? ` Recharge in ${superlikeStatus.nextResetIn}h` : undefined}
              />
              <StatItem 
                icon="👑" 
                label="Membership" 
                value="Free Tier" 
              />
            </div>
          </ProfileCard>

          <ProfileCard>
            <h3 className="font-game-title text-xl text-white mb-4">Battle Records</h3>
            <div className="space-y-3">
              <StatItem icon="⚡" label="Power Ups" value={`+${localUserData?.pointsBreakdown?.likes || 0}`} />
              <StatItem icon="⛔" label="Criticals" value={`+${localUserData?.pointsBreakdown?.dislikes || 0}`} />
              <StatItem icon="⭐" label="Strikes" value={`+${(localUserData?.pointsBreakdown?.superLikes || 0) * 3}`} />
              <StatItem icon="✅" label="Quests Completed" value={`+${localUserData?.pointsBreakdown?.tasks || 0}`} />
              <StatItem icon="🎖️" label="Achievements" value="+0" />
              <StatItem icon="🏰" label="Alliance Bonus" value={`+${localUserData?.pointsBreakdown?.referrals || 0}`} />
            </div>
          </ProfileCard>

          <ProfileCard>
            <h3 className="font-game-title text-xl text-white mb-2">Alliance Program</h3>
            <p className="font-game-body text-gray-400 text-sm mb-4">
              Invite friends into the Meda Portal and earn 20 power points for recruited Meda Warriors!
            </p>

            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#1E1E22] to-[#2A2A2E] p-4">
              <button
                onClick={handleShare}
                disabled={!localUserData?.telegramId}
                className={`w-full px-4 py-3 rounded-lg font-game-title transition-all duration-300 transform hover:scale-105
                  ${shareStatus 
                    ? 'bg-gradient-to-r from-[#4B7BF5]/20 to-[#8A2BE2]/20 text-[#FFD700]' 
                    : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black shadow-lg shadow-[#FFD700]/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {shareStatus || 'Recruit Warriors'}
              </button>
            </div>
          </ProfileCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;