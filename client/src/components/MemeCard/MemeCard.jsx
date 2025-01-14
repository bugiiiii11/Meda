//MemeCard.jsx
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const MemeCard = ({ meme, onSwipe, isTop, isMobile, onDragStart, onDragEnd, isAnimating }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 0, 100], [-15, 0, 15]);
  const opacity = useTransform(
    x,
    [-200, -150, -100, 0, 100, 150, 200],
    [0, 0.5, 0.8, 1, 0.8, 0.5, 0]
  );
  
  const bounceBack = () => {
    x.set(0, { duration: 0.5, type: "spring", stiffness: 300, damping: 20 });
    y.set(0, { duration: 0.5, type: "spring", stiffness: 300, damping: 20 });
  };

  const engagementData = React.useMemo(() => ({
    likes: parseInt(meme.engagement?.likes || 0),
    superLikes: parseInt(meme.engagement?.superLikes || 0),
    dislikes: parseInt(meme.engagement?.dislikes || 0)
  }), [meme.engagement]);

  // Handle sector click
  const handleSectorClick = (e) => {
    e.stopPropagation();
    const sectorUrl = meme.projectDetails?.sectorUrl;
    
    if (sectorUrl) {
      // Check if it's a Telegram bot link with deep linking parameters
      const isTelegramBotLink = sectorUrl.startsWith('https://t.me/') || sectorUrl.startsWith('tg://');
      const hasDeepLinkingParams = sectorUrl.includes('?startapp=') || sectorUrl.includes('/TOD?');
  
      if (isTelegramBotLink) {
        if (window.Telegram?.WebApp) {
          // For deep linking, we need to handle the URL differently
          if (hasDeepLinkingParams) {
            // Keep the URL as is for deep linking
            window.Telegram.WebApp.openTelegramLink(sectorUrl);
          } else {
            // For regular bot links without parameters
            window.Telegram.WebApp.openTelegramLink(sectorUrl);
          }
        } else {
          // Fallback for when Telegram WebApp is not available
          window.open(sectorUrl, '_blank');
        }
      } else {
        // Handle regular URLs
        window.open(sectorUrl, '_blank');
      }
    }
  };

  React.useEffect(() => {
    if (!isTop) return;
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') onSwipe('left');
      if (e.key === 'ArrowRight') onSwipe('right');
      if (e.key === 'ArrowUp') onSwipe('super');
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isTop, onSwipe]);

  return (
    <motion.div
      className="absolute w-full"
      style={{ x, y, rotate, opacity }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      initial={false}
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#4B7BF5]/10 to-[#8A2BE2]/10 rounded-xl blur-lg"></div>
        
        {/* Card content */}
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/5">
          <img
            src={meme.content}
            alt={meme.projectName}
            className="w-full aspect-square object-cover"
          />
          <div className="bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] border-t border-white/5 px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👍</span>
                  <span className="font-game-mono text-white">
                    {engagementData.likes.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg animate-glow-pulse">⚡</span>
                  <span className="font-game-mono text-white">
                    {engagementData.superLikes.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Updated sector button with click handler */}
              <motion.div
                className="flex items-center cursor-pointer"
                initial={{ scale: 0.9 }}
                animate={{
                  scale: 1,
                  transition: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5
                  }
                }}
                onClick={handleSectorClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#4B7BF5]/20 to-[#8A2BE2]/20 
                  border border-white/5 hover:border-white/20 transition-all duration-300">
                  <span className="font-game-title text-[#FFD700]">
                    {meme.projectDetails?.sector || 'GameFi'}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(MemeCard);