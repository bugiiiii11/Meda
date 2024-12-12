// MemeCard.jsx
import { motion, useMotionValue, useTransform } from 'framer-motion';

const QuickStatIcon = ({ children, count, text }) => (
  <div className="flex items-center gap-2">
    <span className="text-xl">{children}</span>
    <div className="flex flex-col">
      <span className="text-gray-200 font-medium">{count.toLocaleString()}</span>
      <span className="text-xs text-gray-400">{text}</span>
    </div>
  </div>
);

const MemeCard = ({ meme, onSwipe, isTop, isMobile, userData, onDragStart, onDragEnd }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-100, 0, 100], [-15, 0, 15]);
  const opacity = useTransform(
    x,
    [-200, -150, -100, 0, 100, 150, 200],
    [0, 0.5, 0.8, 1, 0.8, 0.5, 0]
  );

  const handleDragEnd = (event, info) => {
    const xOffset = info.offset.x;
    const yOffset = info.offset.y;
    const xVelocity = info.velocity.x;
    
    const swipeThreshold = Math.abs(xVelocity) > 500 ? 50 : 100;
    
    if (Math.abs(yOffset) > 100 && Math.abs(yOffset) > Math.abs(xOffset)) {
      onSwipe('super');
    } else if (xOffset > swipeThreshold) {
      onSwipe('right');
    } else if (xOffset < -swipeThreshold) {
      onSwipe('left');
    } else {
      x.set(0);
      y.set(0);
    }

    if (onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <motion.div
      className="absolute w-full"
      style={{ x, y, rotate, opacity }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={onDragStart}
      onDragEnd={handleDragEnd}
      dragElastic={1}
      initial={false}
    >
      <div className="card rounded-xl overflow-hidden shadow-xl">
        <div className="relative w-full aspect-square">
          <img
            src={meme.content}
            className="w-full h-full object-cover"
            aria-label={meme.projectName}
          />
        </div>
        <div className="bg-gradient-to-b from-[#2c2d31] to-[#1a1b1e] border-t border-[#3c3d41]/30 p-4">
          <div className="flex justify-between items-center">
            <QuickStatIcon 
              count={meme.engagement?.likes || 0} 
              text="Likes"
            >
              👍
            </QuickStatIcon>
            <QuickStatIcon 
              count={meme.engagement?.superLikes || 0} 
              text="Super Likes"
            >
              ⭐
            </QuickStatIcon>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemeCard;