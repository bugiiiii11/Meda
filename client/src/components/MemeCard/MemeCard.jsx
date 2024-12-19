//MemeCard.jsx
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const MemeCard = ({ meme, onSwipe, isTop, isMobile, onDragStart, onDragEnd }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 0, 100], [-15, 0, 15]);
  const opacity = useTransform(
    x,
    [-200, -150, -100, 0, 100, 150, 200],
    [0, 0.5, 0.8, 1, 0.8, 0.5, 0]
  );

  // Ensure engagement data is properly initialized
  const engagementData = React.useMemo(() => ({
    likes: parseInt(meme.engagement?.likes || 0),
    superLikes: parseInt(meme.engagement?.superLikes || 0),
    dislikes: parseInt(meme.engagement?.dislikes || 0)
  }), [meme.engagement]);

  // Add keyboard handlers for web testing
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
      <div className="card rounded-xl overflow-hidden shadow-xl">
        <img
          src={meme.content}
          alt={meme.projectName}
          className="w-full aspect-square object-cover"
        />
        <div className="bg-[#1E1E22] border-t border-[#FFD700]/10 px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Left side: Likes and Super Likes */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">👍</span>
                <span className="text-white font-medium">
                  {engagementData.likes.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">⭐</span>
                <span className="text-white font-medium">
                  {engagementData.superLikes.toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Right side: Sector */}
            <div className="flex items-center">
              <span className="text-gray-400 text-sm">
                {meme.projectDetails?.sector || 'Meme'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(MemeCard);