//TasksPage.js
import React from 'react';

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const TasksPage = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-[70]">
        <div className="w-full bg-[#1a1b1e] py-4">
          <div className="w-full px-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#2c2d31] flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                CryptoMeme Bot
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-[72px] px-4">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col gap-4">
            {/* Invite Friends Section */}
            <div className="bg-[#2c2d31] rounded-lg p-4">
              <div className="text-gray-400 text-sm mb-2 text-center">Invite Friends</div>
              <div className="flex items-center gap-2 bg-[#1a1b1e] rounded px-3 py-2">
                <div className="text-gray-200 text-sm truncate flex-1">
                  https://t.me/cryptomememe_bot
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText('https://t.me/cryptomememe_bot')}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  title="Copy invite link"
                >
                  <CopyIcon />
                </button>
              </div>
            </div>

            {/* Website Button */}
            <button
              onClick={() => window.open('https://cryptomeme.me', '_blank')}
              className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
            >
              Website
            </button>

            {/* Join Telegram Chat Button */}
            <button
              onClick={() => window.open('https://t.me/cryptomemebot', '_blank')}
              className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
            >
              Join Telegram Chat
            </button>

            {/* Follow X Button */}
            <button
              onClick={() => window.open('https://t.me/cryptomemebot', '_blank')}
              className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
            >
              Follow X
            </button>

            {/* Follow Instagram Button */}
            <button
              onClick={() => window.open('https://instagram.com/cryptomemebot', '_blank')}
              className="w-full px-4 py-3 bg-[#2c2d31] text-gray-200 rounded-lg text-base font-medium hover:bg-[#3c3d41] transition-all"
            >
              Follow Instagram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksPage;