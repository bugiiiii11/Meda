import React, { useState } from 'react';
import { ENDPOINTS, getHeaders } from '../config/api';

const ProfilePage = ({ userData, onUserDataUpdate }) => {
  const [shareStatus, setShareStatus] = useState('');

  const generateReferralCode = async () => {
    if (!userData?.telegramId) return;
    
    try {
      const response = await fetch(`${ENDPOINTS.base}/api/referrals/create`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ telegramId: userData.telegramId })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && onUserDataUpdate) {
          onUserDataUpdate(data.data);
        }
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
    }
  };

  const handleShare = async () => {
    if (!userData?.referralStats?.referralCode) return;

    const referralLink = `https://t.me/fynderapp_bot?start=${userData.referralStats.referralCode}`;
    const welcomeMessage = `Hello my friend, Join Fynder and find your crypto crush! ${referralLink}`;

    try {
      await navigator.clipboard.writeText(welcomeMessage);
      setShareStatus('Copied!');

      // Open Telegram sharing if available
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink('tg://msg_contacts');
      }

      setTimeout(() => setShareStatus(''), 2000);
    } catch (error) {
      console.error('Share error:', error);
      setShareStatus('Error');
      setTimeout(() => setShareStatus(''), 2000);
    }
  };

  // Show loading state only if userData is null
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
          {/* Points Card */}
          <div className="bg-[#1E1E22] rounded-xl p-6 border border-[#FFD700]/10">
            <div className="text-center">
              <span className="text-4xl font-serif text-[#FFD700]">
                {userData?.totalPoints || 0}
              </span>
              <p className="text-gray-400 mt-1">Total Points</p>
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
            
            {/* Referral Stats */}
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div className="bg-[#2A2A2E] p-4 rounded-lg text-center">
                <p className="text-[#FFD700] text-xl font-serif">
                  {userData?.referralStats?.referredUsers?.length || 0}
                </p>
                <p className="text-gray-400 text-sm">Referrals</p>
              </div>
              <div className="bg-[#2A2A2E] p-4 rounded-lg text-center">
                <p className="text-[#FFD700] text-xl font-serif">
                  {userData?.pointsBreakdown?.referrals || 0}
                </p>
                <p className="text-gray-400 text-sm">Points Earned</p>
              </div>
            </div>

            {/* Referral Link and Share Button */}
            <div className="bg-[#2A2A2E] p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between gap-4">
                <code className="text-[#FFD700] font-mono text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {userData?.referralStats?.referralCode ? 
                    `https://t.me/fynderapp_bot?start=${userData.referralStats.referralCode}` : 
                    'Loading...'}
                </code>
              </div>
              <button
                onClick={handleShare}
                disabled={!userData?.referralStats?.referralCode}
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