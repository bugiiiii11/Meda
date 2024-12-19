import React, { useState } from 'react';

const ProfilePage = ({ userData }) => {
  const [shareStatus, setShareStatus] = useState('');

  const handleShare = async () => {
    if (!userData?.telegramId) return;

    const referralLink = `https://t.me/fynderapp_bot?start=${userData.telegramId}`;
    const welcomeMessage = `Hello my friend, Join Fynder and find your crypto crush! ${referralLink}`;

    try {
      await navigator.clipboard.writeText(welcomeMessage);
      setShareStatus('Copied!');

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
      setShareStatus('Error');
      setTimeout(() => setShareStatus(''), 2000);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#121214]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#FFD700] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#121214]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#121214]">
        <div className="w-full py-6 border-b border-[#FFD700]/10">
          <div className="text-center">
            <h1 className="text-2xl font-serif text-white">My Profile</h1>
            <p className="text-gray-400 text-sm">@{userData?.username || 'Anonymous'}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pt-[100px] pb-20 px-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* My Stats Section */}
          <div className="bg-[#1E1E22] rounded-xl p-6 border border-[#FFD700]/10">
            <h3 className="text-lg font-medium text-white mb-4">My Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Points', icon: '🏆', value: userData?.totalPoints || 0 },
                { label: 'Referrals', icon: '👥', value: userData?.referralStats?.referredUsers?.length || 0 },
                { label: 'Available Super Likes', icon: '⭐', value: 'X' },
                { label: 'My Membership', icon: '👑', value: 'Free Tier' }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-[#2A2A2E] rounded-lg hover:bg-[#2F2F33] transition-colors"
                >
                  <span className="text-gray-300 flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="text-[#FFD700] font-serif">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Points Breakdown */}
          <div className="bg-[#1E1E22] rounded-xl p-6 border border-[#FFD700]/10">
            <h3 className="text-lg font-medium text-white mb-4">Points Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'Likes', icon: '👍', points: userData?.pointsBreakdown?.likes || 0 },
                { label: 'Dislikes', icon: '👎', points: userData?.pointsBreakdown?.dislikes || 0 },
                { label: 'Super Likes', icon: '⭐', points: (userData?.pointsBreakdown?.superLikes || 0) * 3 },
                { label: 'Tasks Completed', icon: '✅', points: userData?.pointsBreakdown?.tasks || 0 },
                { label: 'Achievements', icon: '🏅', points: 0 },
                { label: 'Referral Bonus', icon: '🎁', points: userData?.pointsBreakdown?.referrals || 0 }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-[#2A2A2E] rounded-lg hover:bg-[#2F2F33] transition-colors"
                >
                  <span className="text-gray-300 flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="text-[#FFD700] font-serif">+{item.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Referral Section */}
          <div className="bg-[#1E1E22] rounded-xl p-6 border border-[#FFD700]/10">
            <h3 className="text-lg font-medium text-white mb-2">Referral Program</h3>
            <p className="text-gray-400 text-sm mb-4">
              Invite friends and earn 20 points for each referral!
            </p>

            {/* Referral Link and Share Button */}
            <div className="bg-[#2A2A2E] p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between gap-4">
                <code className="text-[#FFD700] font-mono text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {userData?.telegramId ? 
                    `https://t.me/fynderapp_bot?start=${userData.telegramId}` : 
                    'Loading...'}
                </code>
              </div>
              <button
                onClick={handleShare}
                disabled={!userData?.telegramId}
                className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                  shareStatus ? 
                  'bg-[#FFD700]/20 text-[#FFD700]' : 
                  'bg-[#FFD700] text-black hover:bg-[#FFD700]/90'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {shareStatus || 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;