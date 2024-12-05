import React, { useState, useEffect } from 'react';
import { ENDPOINTS } from '../config/api';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#1a1b1e] p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400">@{userData?.username || 'Anonymous'}</p>
      </div>

      {/* Points Overview */}
      <div className="bg-[#2c2d31] rounded-lg p-4 mb-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">{userData?.totalPoints || 0}</h2>
          <p className="text-green-400">Total Points</p>
        </div>
      </div>

      {/* Points Breakdown */}
      <div className="bg-[#2c2d31] rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-white mb-3">Points Breakdown</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Likes (👍)</span>
            <span className="text-white">+{userData?.pointsBreakdown?.likes || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Dislikes (👎)</span>
            <span className="text-white">+{userData?.pointsBreakdown?.dislikes || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Super Likes (⭐)</span>
            <span className="text-white">+{userData?.pointsBreakdown?.superLikes * 3 || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Tasks Completed</span>
            <span className="text-white">+{userData?.pointsBreakdown?.tasks || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Referral Bonus</span>
            <span className="text-white">+{userData?.pointsBreakdown?.referrals || 0}</span>
          </div>
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-[#2c2d31] rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-3">Referral Program</h3>
        <p className="text-gray-400 text-sm mb-2">
          Invite friends and earn 20 points for each referral!
        </p>
        <div className="bg-[#1a1b1e] p-3 rounded flex justify-between items-center">
          <code className="text-green-400">{userData?.referralStats?.referralCode || 'Generate Code'}</code>
          <button 
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            onClick={() => {/* Add copy function */}}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;