// MemeStack.jsx
import React, { useEffect } from 'react';  // Add useEffect to imports
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

  console.log('MemeStack initial memes:', memes.map(m => ({
    id: m.id,
    projectName: m.projectName,
    engagement: m.engagement
  })));


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

    console.log('Available memes with engagement:', 
      availableMemes.map(m => ({
        id: m.id,
        engagement: m.engagement
      }))
    );

    const totalWeight = availableMemes.reduce((sum, meme) => sum + (meme.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const meme of availableMemes) {
      random -= (meme.weight || 1);
      if (random <= 0) {
        // Make sure to preserve the engagement data
        const selectedMeme = {
          ...meme,
          engagement: {
            likes: meme.engagement?.likes || 0,
            superLikes: meme.engagement?.superLikes || 0,
            dislikes: meme.engagement?.dislikes || 0
          }
        };
        console.log('Selected meme with engagement:', selectedMeme);
        return selectedMeme;
      }
    }
    
    // Preserve engagement data for fallback case too
    return {
      ...availableMemes[0],
      engagement: {
        likes: availableMemes[0].engagement?.likes || 0,
        superLikes: availableMemes[0].engagement?.superLikes || 0,
        dislikes: availableMemes[0].engagement?.dislikes || 0
      }
    };
  }, [memes, currentMeme]);

  // When initializing memes
  React.useEffect(() => {
    if (memes.length > 0 && !currentMeme) {
      console.log('Initializing first meme with engagement data');
      const firstMeme = propCurrentMeme || getWeightedRandomMeme();
      console.log('First meme:', firstMeme);
      
      setCurrentMeme(firstMeme);
      onMemeChange(firstMeme);
      
      const secondMeme = getWeightedRandomMeme();
      console.log('Next meme:', secondMeme);
      setNextMeme(secondMeme);
    }
  }, [memes, propCurrentMeme, getWeightedRandomMeme, onMemeChange]);

  const transitionToNextMeme = React.useCallback(() => {
    if (!nextMeme) return;
    
    console.log('Transitioning to next meme with engagement:', nextMeme);
    setCurrentMeme(nextMeme);
    onMemeChange(nextMeme);
    
    const newNextMeme = getWeightedRandomMeme();
    console.log('New next meme with engagement:', newNextMeme);
    setNextMeme(newNextMeme);
  }, [nextMeme, getWeightedRandomMeme, onMemeChange]);
  

  React.useEffect(() => {
    setIsMobile(!!window.Telegram?.WebApp);
  }, []);



  const handleSwipe = async (direction) => {
    console.log('Current meme before swipe:', {
      id: currentMeme.id,
      engagement: currentMeme.engagement
    });
    if (isAnimating || !currentMeme) return;
    
    console.log('Handling swipe:', direction);
    console.log('Current meme before swipe:', currentMeme?.id);
    console.log('Next meme before swipe:', nextMeme?.id);
    
    setIsAnimating(true);
    setLastSwipe(direction);
  
    // First transition to next meme
    transitionToNextMeme();
  
    try {
      const action = direction === 'right' ? 'like' : 
                    direction === 'left' ? 'dislike' : 'superlike';
  
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
        
        console.log('Current meme after swipe:', currentMeme?.id);
        console.log('Next meme after swipe:', nextMeme?.id);
      }, 300);
    }
  };

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