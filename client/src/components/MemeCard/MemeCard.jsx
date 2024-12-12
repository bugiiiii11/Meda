import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const QuickStatIcon = ({ children, count, text }) => (
  <div className="flex items-center gap-2">
    <span className="text-xl">{children}</span>
    <div className="flex flex-col">
      <span className="text-gray-200 font-medium">{count}</span>
      <span className="text-xs text-gray-400">{text}</span>
    </div>
  </div>
);

const MemeCard = ({ meme, onSwipe, isTop, isMobile, userData }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 0, 100], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const [imageError, setImageError] = React.useState(false);

  // Log component props for debugging
  React.useEffect(() => {
    console.log('MemeCard props:', { meme, isTop, userData });
  }, [meme, isTop, userData]);

  const handleDragEnd = (_, info) => {
    if (!userData) {
      console.error('No user data available for interaction');
      return;
    }

    const xValue = x.get();
    const yValue = y.get();
    
    if (yValue < -100) {
      onSwipe('super');
    } else if (xValue > 100) {
      onSwipe('right');
    } else if (xValue < -100) {
      onSwipe('left');
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleClick = (action) => {
    if (!userData) {
      console.error('No user data available for interaction');
      return;
    }
    onSwipe(action);
  };

  return (
    <motion.div
      className="absolute w-full"
      style={{ x, y, rotate, opacity }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      dragElastic={1}
      initial={false}
    >
      <div className="card rounded-xl overflow-hidden shadow-xl">
        <img
          src={meme.content}
          alt={meme.projectName}
          className="w-full aspect-square object-cover"
          onError={(e) => {
            console.error('Image load error:', meme.content);
            setImageError(true);
            e.target.src = '/placeholder.png';
          }}
        />
        <div className="bg-gradient-to-b from-[#2c2d31] to-[#1a1b1e] border-t border-[#3c3d41]/30 p-4">
          <div className="flex justify-between items-center">
            <QuickStatIcon count={meme.engagement?.likes || 0} text="Likes">
              👍
            </QuickStatIcon>
            <QuickStatIcon count={meme.engagement?.superLikes || 0} text="Super Likes">
              ⭐
            </QuickStatIcon>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemeCard;