// MemeStack.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemeCard from '../MemeCard/MemeCard';
import { ENDPOINTS } from '../../config/api';

const MemeStack = ({ memes, onMemeChange, currentMeme: propCurrentMeme, userData }) => {
  const [currentMeme, setCurrentMeme] = React.useState(null);
  const [nextMeme, setNextMeme] = React.useState(null);
  const [lastSwipe, setLastSwipe] = React.useState(null);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const getNextMeme = React.useCallback(async () => {
    try {
      if (!userData?.telegramId) return null;
      
      const response = await fetch(ENDPOINTS.memes.next(userData.telegramId), {
        headers: getHeaders()
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching next meme:', error);
      return null;
    }
  }, [userData]);

  React.useEffect(() => {
    const initializeMemes = async () => {
      if (!currentMeme) {
        const firstMeme = await getNextMeme();
        if (firstMeme) {
          setCurrentMeme(firstMeme);
          onMemeChange(firstMeme);
          
          const secondMeme = await getNextMeme();
          if (secondMeme) {
            setNextMeme(secondMeme);
          }
        }
      }
    };
    
    initializeMemes();
  }, [userData]);

  const handleSwipe = async (direction) => {
    if (isAnimating || !currentMeme) return;
    
    setIsAnimating(true);
    setLastSwipe(direction);

    try {
      const action = direction === 'right' ? 'like' : 
                    direction === 'left' ? 'dislike' : 'superlike';

      const response = await fetch(ENDPOINTS.interactions.update, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          action,
          memeId: currentMeme.id,
          telegramId: userData?.telegramId
        })
      });

      const data = await response.json();
      console.log('Interaction response:', data);

      // Transition to next meme
      if (nextMeme) {
        setCurrentMeme(nextMeme);
        onMemeChange(nextMeme);
        
        // Fetch new next meme
        const newNextMeme = await getNextMeme();
        if (newNextMeme) {
          setNextMeme(newNextMeme);
        }
      }

    } catch (error) {
      console.error('Interaction error:', error);
    } finally {
      setTimeout(() => {
        setLastSwipe(null);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="relative max-w-[calc(100vw-32px)] mx-auto aspect-square">
      {/* Next Meme (Background) */}
      <div className="absolute inset-0 z-10">
        {nextMeme && (
          <MemeCard
            meme={nextMeme}
            onSwipe={() => {}}
            isTop={false}
            userData={userData}
          />
        )}
      </div>

      {/* Current Meme */}
      <AnimatePresence mode="wait">
        {currentMeme && !isAnimating && (
          <motion.div
            key={currentMeme.id}
            className="absolute inset-0 z-20"
            initial={false}
            animate={{ x: 0, y: 0, opacity: isDragging ? 0.5 : 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.1 }
            }}
          >
            <MemeCard
              meme={currentMeme}
              onSwipe={handleSwipe}
              isTop={true}
              isMobile={isMobile}
              userData={userData}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Indicator */}
      <AnimatePresence>
        {lastSwipe && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className={`px-8 py-4 rounded-2xl border-4 border-white shadow-xl backdrop-blur-sm ${
                lastSwipe === 'right' ? 'bg-green-500/90' :
                lastSwipe === 'left' ? 'bg-red-500/90' :
                'bg-blue-500/90'
              }`}
            >
              <div className="text-4xl font-bold text-white">
                {lastSwipe === 'right' ? 'LIKE' : lastSwipe === 'left' ? 'NOPE' : 'SUPER'}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemeStack;