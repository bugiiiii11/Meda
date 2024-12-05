//MemeCard.jsx
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

const MemeCard = ({ meme, onSwipe, isTop }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 0, 100], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Add image error handling
  const [imageError, setImageError] = React.useState(false);

  // Log meme data for debugging
  React.useEffect(() => {
    console.log('Meme data:', meme);
  }, [meme]);

  const handleDragEnd = (_, info) => {
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

  // Add click handlers for browser interaction
  const handleClick = (action) => {
    onSwipe(action);
  };

  return (
    <motion.div
      className="absolute w-full"
      style={{ x, y, rotate, opacity }}
      drag={isTop ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      dragElastic={1}
      initial={false}
      transition={{
        type: "spring",
        damping: 50,
        stiffness: 500
      }}
    >
      <div className="card rounded-xl overflow-hidden shadow-xl">
        <img
          src={meme.content}
          alt={meme.projectName}
          className="w-full aspect-square object-cover"
          onError={(e) => {
            console.error('Image load error:', meme.content);
            setImageError(true);
            e.target.src = '/placeholder.png'; // Add a placeholder image
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
            {/* Add browser interaction buttons */}
            {isTop && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleClick('left')}
                  className="p-2 rounded-full hover:bg-red-500/20"
                >
                  👎
                </button>
                <button
                  onClick={() => handleClick('right')}
                  className="p-2 rounded-full hover:bg-green-500/20"
                >
                  👍
                </button>
                <button
                  onClick={() => handleClick('super')}
                  className="p-2 rounded-full hover:bg-blue-500/20"
                >
                  ⭐
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemeCard;