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
  const getWeightedRandomMeme = () => {
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
    
    return {
      ...availableMemes[0],
      engagement: availableMemes[0]?.engagement || { likes: 0, superLikes: 0 }
    };
  };

  // Initialize memes
  React.useEffect(() => {
    if (memes.length > 0 && !currentMeme) {
      const firstMeme = propCurrentMeme || getWeightedRandomMeme();
      console.log('Initial meme:', firstMeme);
      setCurrentMeme(firstMeme);
      
      const secondMeme = getWeightedRandomMeme();
      setNextMeme(secondMeme);
    }
  }, [memes, propCurrentMeme]);

  // Check if running in Telegram WebApp
  React.useEffect(() => {
    setIsMobile(!!window.Telegram?.WebApp);
  }, []);

  const handleSwipe = async (direction) => {
    if (isAnimating || !currentMeme) return;
    
    setIsAnimating(true);
    setLastSwipe(direction);

    try {
      const action = direction === 'right' ? 'like' : 
                    direction === 'left' ? 'dislike' : 'superlike';
      
      console.log('Handling swipe:', {
        direction,
        action,
        memeId: currentMeme.id,
        userData
      });

      if (!userData?.telegramId) {
        console.error('No user data available for interaction');
        throw new Error('User data not available');
      }

      const response = await fetch(ENDPOINTS.interactions.update, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({
          action,
          memeId: currentMeme.id,
          telegramId: userData.telegramId
        })
      });

      const data = await response.json();
      console.log('Interaction response:', data);

      if (data.success) {
        // Update current meme with new engagement data
        const updatedCurrentMeme = {
          ...currentMeme,
          engagement: data.data.meme.engagement
        };
        
        // Trigger meme change after successful interaction
        setTimeout(() => {
          setCurrentMeme(nextMeme);
          const newNextMeme = getWeightedRandomMeme();
          setNextMeme(newNextMeme);
          onMemeChange(nextMeme);
        }, 500); // Wait for animation
      } else {
        throw new Error(data.error || 'Interaction failed');
      }
    } catch (error) {
      console.error('Interaction error:', error);
      // Show error toast or feedback to user
    } finally {
      // Reset animation state after delay
      setTimeout(() => {
        setLastSwipe(null);
        setIsAnimating(false);
      }, 800);
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="relative max-w-[calc(100vw-32px)] mx-auto aspect-square">
      <AnimatePresence>
        {lastSwipe && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className={`px-8 py-4 rounded-2xl border-4 border-white shadow-xl backdrop-blur-sm ${
              lastSwipe === 'right' ? 'bg-green-500/90' :
              lastSwipe === 'left' ? 'bg-red-500/90' :
              'bg-blue-500/90'
            }`}>
              <div className="text-4xl font-bold text-white">
                {lastSwipe === 'right' ? 'LIKE' : lastSwipe === 'left' ? 'NOPE' : 'SUPER'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Meme */}
      <AnimatePresence>
        {currentMeme && (
          <motion.div
            key={currentMeme.id + "-current"}
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
        
        {/* Next Meme (Background) */}
        {nextMeme && (
          <motion.div
            key={nextMeme.id + "-next"}
            className="absolute inset-0 z-10"
            initial={{ scale: 0.95, y: 8 }}
            animate={{ scale: 0.95, y: 8 }}
          >
            <MemeCard
              meme={nextMeme}
              onSwipe={() => {}}
              isTop={false}
              userData={userData}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Browser Controls */}
      {!isMobile && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-4">
          <button
            onClick={() => handleSwipe('left')}
            className="p-4 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors"
          >
            👎
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="p-4 rounded-full bg-green-500/20 hover:bg-green-500/40 transition-colors"
          >
            👍
          </button>
          <button
            onClick={() => handleSwipe('super')}
            className="p-4 rounded-full bg-blue-500/20 hover:bg-blue-500/40 transition-colors"
          >
            ⭐
          </button>
        </div>
      )}
    </div>
  );
};

export default MemeStack;