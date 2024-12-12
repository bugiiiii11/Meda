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

  // Function to select a random meme
  const getWeightedRandomMeme = React.useCallback(() => {
    const availableMemes = memes.filter(meme => meme.id !== currentMeme?.id);
    if (availableMemes.length === 0) return memes[0];

    const totalWeight = availableMemes.reduce((sum, meme) => sum + (meme.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const meme of availableMemes) {
      random -= (meme.weight || 1);
      if (random <= 0) {
        return {
          ...meme,
          engagement: meme.engagement || { likes: 0, superLikes: 0 }
        };
      }
    }
    
    return availableMemes[0];
  }, [memes, currentMeme]);

  // Initialize memes
  React.useEffect(() => {
    if (memes.length > 0 && !currentMeme) {
      const firstMeme = propCurrentMeme || getWeightedRandomMeme();
      console.log('Initial meme:', firstMeme);
      setCurrentMeme(firstMeme);
      onMemeChange(firstMeme);
      
      const secondMeme = getWeightedRandomMeme();
      console.log('Preloading next meme:', secondMeme);
      setNextMeme(secondMeme);
    }
  }, [memes, propCurrentMeme, getWeightedRandomMeme, onMemeChange]);

  // Check if running in Telegram WebApp
  React.useEffect(() => {
    setIsMobile(!!window.Telegram?.WebApp);
  }, []);

  // Preload next meme image
  React.useEffect(() => {
    if (nextMeme) {
      const img = new Image();
      img.src = nextMeme.content;
    }
  }, [nextMeme]);

  const transitionToNextMeme = React.useCallback(() => {
    if (!nextMeme) return;
    
    // Update current meme immediately
    setCurrentMeme(nextMeme);
    onMemeChange(nextMeme);
    
    // Prepare next meme in advance
    const newNextMeme = getWeightedRandomMeme();
    console.log('Preparing next meme:', newNextMeme);
    setNextMeme(newNextMeme);
  }, [nextMeme, getWeightedRandomMeme, onMemeChange]);

  const handleSwipe = async (direction) => {
    if (isAnimating || !currentMeme) return;
    
    setIsAnimating(true);
    setLastSwipe(direction);

    try {
      const action = direction === 'right' ? 'like' : 
                    direction === 'left' ? 'dislike' : 'superlike';

      // Start meme transition immediately
      setTimeout(transitionToNextMeme, 200);

      // Send interaction to backend
      const response = await fetch(ENDPOINTS.interactions.update, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          action,
          memeId: currentMeme.id,
          telegramId: userData?.telegramId
        })
      });

      const data = await response.json();
      console.log('Interaction response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Interaction failed');
      }
    } catch (error) {
      console.error('Interaction error:', error);
    } finally {
      // Reset animation state after short delay
      setTimeout(() => {
        setLastSwipe(null);
        setIsAnimating(false);
      }, 500);
    }
  };

  return (
    <div className="relative max-w-[calc(100vw-32px)] mx-auto aspect-square">
      {/* Swipe Indicator */}
      <AnimatePresence>
        {lastSwipe && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className={`px-8 py-4 rounded-2xl border-4 border-white shadow-xl backdrop-blur-sm ${
                lastSwipe === 'right' ? 'bg-green-500/90' :
                lastSwipe === 'left' ? 'bg-red-500/90' :
                'bg-blue-500/90'
              }`}
              animate={{
                rotate: lastSwipe === 'right' ? 12 : lastSwipe === 'left' ? -12 : 0
              }}
            >
              <div className="text-4xl font-bold text-white flex items-center gap-3">
                <span>
                  {lastSwipe === 'right' ? 'LIKE' : lastSwipe === 'left' ? 'NOPE' : 'SUPER'}
                </span>
                <span className="text-5xl">
                  {lastSwipe === 'right' ? '👍' : lastSwipe === 'left' ? '👎' : '⭐'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meme Cards */}
      <AnimatePresence mode="wait">
        {currentMeme && (
          <motion.div
            key={currentMeme.id}
            className="absolute inset-0 z-20"
            initial={{ scale: 0.95, y: 8, opacity: 0.8 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ 
              x: lastSwipe === 'right' ? 1000 : lastSwipe === 'left' ? -1000 : 0,
              y: lastSwipe === 'super' ? -1000 : 0,
              opacity: 0,
              scale: 0.8,
              transition: { duration: 0.2 }
            }}
          >
            <MemeCard
              meme={currentMeme}
              onSwipe={handleSwipe}
              isTop={true}
              isMobile={isMobile}
              userData={userData}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Meme (Preloaded) */}
      {nextMeme && (
        <div className="absolute inset-0 z-10">
          <MemeCard
            meme={nextMeme}
            onSwipe={() => {}}
            isTop={false}
            userData={userData}
          />
        </div>
      )}

      {/* Desktop Controls */}
      {!isMobile && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-4">
          <button
            onClick={() => !isAnimating && handleSwipe('left')}
            className="p-4 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors"
            disabled={isAnimating}
          >
            👎
          </button>
          <button
            onClick={() => !isAnimating && handleSwipe('right')}
            className="p-4 rounded-full bg-green-500/20 hover:bg-green-500/40 transition-colors"
            disabled={isAnimating}
          >
            👍
          </button>
          <button
            onClick={() => !isAnimating && handleSwipe('super')}
            className="p-4 rounded-full bg-blue-500/20 hover:bg-blue-500/40 transition-colors"
            disabled={isAnimating}
          >
            ⭐
          </button>
        </div>
      )}
    </div>
  );
};

export default MemeStack;