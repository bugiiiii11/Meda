// MemeStack.jsx
import React, { useEffect } from 'react';  // Add useEffect to imports
import { motion, AnimatePresence } from 'framer-motion';
import MemeCard from '../MemeCard/MemeCard';
import { ENDPOINTS } from '../../config/api';

const MemeStack = ({ memes, onMemeChange, currentMeme: propCurrentMeme, userData }) => {
  console.log('MemeStack received memes:', memes.map(meme => ({
    id: meme.id,
    projectName: meme.projectName,
    engagement: meme.engagement
  })));

  const [currentMeme, setCurrentMeme] = React.useState(null);
  const [nextMeme, setNextMeme] = React.useState(null);
  const [lastSwipe, setLastSwipe] = React.useState(null);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  useEffect(() => {
    if (currentMeme) {
      console.log('Current meme full data:', {
        id: currentMeme.id,
        projectName: currentMeme.projectName,
        engagement: currentMeme.engagement
      });
    }
    if (nextMeme) {
      console.log('Next meme full data:', {
        id: nextMeme.id,
        projectName: nextMeme.projectName,
        engagement: nextMeme.engagement
      });
    }
  }, [currentMeme, nextMeme]);


  const getWeightedRandomMeme = React.useCallback(() => {
    const availableMemes = memes.filter(meme => meme.id !== currentMeme?.id);
    if (availableMemes.length === 0) return memes[0];

    const totalWeight = availableMemes.reduce((sum, meme) => sum + (meme.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const meme of availableMemes) {
      random -= (meme.weight || 1);
      if (random <= 0) {
        // Make sure engagement exists
        return {
          ...meme,
          engagement: {
            likes: meme.engagement?.likes || 0,
            superLikes: meme.engagement?.superLikes || 0,
            dislikes: meme.engagement?.dislikes || 0
          }
        };
      }
    }
    
    return {
      ...availableMemes[0],
      engagement: {
        likes: availableMemes[0].engagement?.likes || 0,
        superLikes: availableMemes[0].engagement?.superLikes || 0,
        dislikes: availableMemes[0].engagement?.dislikes || 0
      }
    };
  }, [memes, currentMeme]);


  React.useEffect(() => {
    if (memes.length > 0 && !currentMeme) {
      const firstMeme = propCurrentMeme || getWeightedRandomMeme();
      setCurrentMeme(firstMeme);
      onMemeChange(firstMeme);
      
      const secondMeme = getWeightedRandomMeme();
      setNextMeme(secondMeme);
    }
  }, [memes, propCurrentMeme, getWeightedRandomMeme, onMemeChange]);

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

      // First transition to next meme
      transitionToNextMeme();  // Move this before the API call

      // Then update the interaction in the background
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
      setTimeout(() => {
        setLastSwipe(null);
        setIsAnimating(false);
      }, 300);
    }
  };


  const transitionToNextMeme = React.useCallback(() => {
    if (!nextMeme) return;
    
    setCurrentMeme(nextMeme);
    onMemeChange(nextMeme);
    
    // Generate next meme immediately
    const newNextMeme = getWeightedRandomMeme();
    setNextMeme(newNextMeme);
  }, [nextMeme, getWeightedRandomMeme, onMemeChange]);

  return (
    <div className="relative max-w-[calc(100vw-32px)] mx-auto aspect-square">
      {/* Next Meme (Background) - Always visible */}
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
      {currentMeme && (
        <motion.div
          key={currentMeme.id}
          className="absolute inset-0 z-20"
          initial={false}
          animate={{ 
            opacity: isDragging ? 0.5 : 1,
            scale: 1
          }}
          exit={{ 
            opacity: 0,
            transition: { 
              duration: 0.1,
              ease: "linear"
            }
          }}
        >
          <MemeCard
            meme={currentMeme}
            onSwipe={handleSwipe}
            isTop={true}
            isMobile={isMobile}
            userData={userData}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              setIsDragging(false);
              const xVel = info.velocity.x;
              const yVel = info.velocity.y;
              const xOffset = info.offset.x;
              const yOffset = info.offset.y;
              
              if (Math.abs(yVel) > Math.abs(xVel) && yOffset < -50) {
                handleSwipe('super');
              } else if (xOffset > 50) {
                handleSwipe('right');
              } else if (xOffset < -50) {
                handleSwipe('left');
              }
            }}
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
              <div className="text-4xl font-bold text-white flex items-center gap-3">
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