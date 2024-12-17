import React, { useState, useEffect } from 'react';
import { ENDPOINTS } from '../config/api';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        ENDPOINTS.users.get(telegramUser?.id || 'test123')
      );
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferralCode = () => {
    if (userData?.referralStats?.referralCode) {
      navigator.clipboard.writeText(userData.referralStats.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
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
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1E1E22] flex items-center justify-center">
              <span className="text-[#FFD700] text-2xl">👤</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-serif text-white">Profile</h1>
              <p className="text-gray-400 text-sm">@{userData?.username || 'Anonymous'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content - Adjusted padding-top */}
      <div className="flex-1 overflow-auto pt-[120px] pb-20 px-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Total Points Card */}
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
            <div className="bg-[#2A2A2E] p-4 rounded-lg flex items-center justify-between gap-4">
              <code className="text-[#FFD700] font-mono overflow-auto">
                {userData?.referralStats?.referralCode || 'Generate Code'}
              </code>
              <button
                onClick={handleCopyReferralCode}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  copied
                    ? 'bg-[#FFD700]/20 text-[#FFD700]'
                    : 'bg-[#FFD700] text-black hover:bg-[#FFD700]/90'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;