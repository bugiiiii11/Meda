import React, { useState } from 'react';

const ProfileCard = ({ children, className = '' }) => (
  <div className="relative group">
    {/* Background glow effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#4B7BF5]/5 to-[#8A2BE2]/5 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
    
    {/* Card content */}
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

const ProfilePage = ({ userData, superlikeStatus }) => {
  const [shareStatus, setShareStatus] = useState('');

  const handleShare = async () => {
    if (!userData?.telegramId) return;

    const referralLink = `https://t.me/MedaPortalBot?start=${userData.telegramId}`;
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

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0A0B0F]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4B7BF5] border-t-transparent 
          shadow-lg shadow-[#4B7BF5]/20"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0B0F]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0A0B0F] via-[#0A0B0F] to-transparent">
        <div className="w-full py-6 border-b border-white/5">
          <div className="text-center">
            <h1 className="font-game-title text-3xl bg-gradient-to-r from-[#4B7BF5] to-[#8A2BE2] text-transparent bg-clip-text">
              Battle Profile
            </h1>
            <p className="font-game-mono text-gray-400 text-sm mt-1">@{userData?.username || 'Anonymous'}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pt-[100px] pb-20 px-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* My Stats Section */}
          <ProfileCard>
            <h3 className="font-game-title text-xl text-white mb-4">Combat Stats</h3>
            <div className="space-y-3">
              <StatItem 
                icon="🏆" 
                label="Total Power" 
                value={userData?.totalPoints || 0} 
              />
              <StatItem 
                icon="👥" 
                label="Alliance Members" 
                value={userData?.referralStats?.referredUsers?.length || 0} 
              />
              <StatItem 
                icon="⚡" 
                label="Energy Crystals" 
                value={superlikeStatus?.remainingSuperlikes || 0}
                subtitle={superlikeStatus?.nextResetIn ? `Recharges in ${superlikeStatus.nextResetIn}h` : undefined}
              />
              <StatItem 
                icon="👑" 
                label="Rank" 
                value="Free Tier" 
              />
            </div>
          </ProfileCard>

          {/* Points Breakdown */}
          <ProfileCard>
            <h3 className="font-game-title text-xl text-white mb-4">Battle Records</h3>
            <div className="space-y-3">
              <StatItem icon="👍" label="Approvals" value={`+${userData?.pointsBreakdown?.likes || 0}`} />
              <StatItem icon="👎" label="Rejections" value={`+${userData?.pointsBreakdown?.dislikes || 0}`} />
              <StatItem icon="⚡" label="Power Strikes" value={`+${(userData?.pointsBreakdown?.superLikes || 0) * 3}`} />
              <StatItem icon="✅" label="Quests Completed" value={`+${userData?.pointsBreakdown?.tasks || 0}`} />
              <StatItem icon="🏅" label="Achievement Points" value="+0" />
              <StatItem icon="🎁" label="Alliance Bonus" value={`+${userData?.pointsBreakdown?.referrals || 0}`} />
            </div>
          </ProfileCard>

          {/* Referral Section */}
          <ProfileCard>
            <h3 className="font-game-title text-xl text-white mb-2">Alliance Program</h3>
            <p className="font-game-body text-gray-400 text-sm mb-4">
              Recruit warriors and earn 20 power points for each ally!
            </p>

            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#1E1E22] to-[#2A2A2E] p-4">
              <button
                onClick={handleShare}
                disabled={!userData?.telegramId}
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