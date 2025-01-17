// src/components/modals/CongratulationsModal.jsx
import React from 'react';

const CongratulationsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] p-6 rounded-xl border border-white/10 max-w-sm w-full mx-4">
        <h2 className="font-game-title text-2xl text-center text-white mb-4">
          Congratulations Meda Warrior!
        </h2>
        <p className="text-center text-gray-300 mb-6">
          You Completed the Achievement!
        </p>
        <button
          onClick={onClose}
          className="w-full px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-game-title rounded-lg transition-transform hover:scale-105"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CongratulationsModal;