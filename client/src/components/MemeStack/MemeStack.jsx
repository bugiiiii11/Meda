// MemeStack.jsx
import React, { useEffect } from 'react';
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

  console.log('===== DEBUG: MemeStack Props =====');
  console.log('Received memes:', memes.map(m => ({
    id: m.id,
    projectName: m.projectName,
    engagement: m.engagement || { likes: 0, superLikes: 0, dislikes: 0 }
  })));
  console.log('================================');

  const getWeightedRandomMeme = React.useCallback(() => {
    console.log('===== Getting Random Meme =====');
    console.log('Total memes available:', memes.length);
    
    const currentMemeId = currentMeme?.id;
    console.log('Current meme ID:', currentMemeId);
    
    const availableMemes = currentMemeId 
      ? memes.filter(meme => meme.id !== currentMemeId)
      : [...memes];
    
    console.log('Filtered available memes:', availableMemes.length);

    if (availableMemes.length === 0) {
      console.log('No available memes, returning first meme');
      const firstMeme = {
        ...memes[0],
        engagement: memes[0].engagement || { likes: 0, superLikes: 0, dislikes: 0 }
      };
      return firstMeme;
    }
  
    // Calculate total weight for weighted random selection
    const totalWeight = availableMemes.reduce((sum, meme) => sum + (meme.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const meme of availableMemes) {
      random -= (meme.weight || 1);
      if (random <= 0) {
        const selectedMeme = {
          ...meme,
          engagement: {
            likes: parseInt(meme.engagement?.likes || 0),
            superLikes: parseInt(meme.engagement?.superLikes || 0),
            dislikes: parseInt(meme.engagement?.dislikes || 0)
          }
        };
        
        console.log('Selected meme with engagement:', {
          id: selectedMeme.id,
          projectName: selectedMeme.projectName,
          engagement: selectedMeme.engagement
        });
        
        return selectedMeme;
      }
    }
    
    // Fallback case
    const fallbackMeme = {
      ...availableMemes[0],
      engagement: {
        likes: parseInt(availableMemes[0].engagement?.likes || 0),
        superLikes: parseInt(availableMemes[0].engagement?.superLikes || 0),
        dislikes: parseInt(availableMemes[0].engagement?.dislikes || 0)
      }
    };
    
    console.log('Fallback meme selected:', {
      id: fallbackMeme.id,
      projectName: fallbackMeme.projectName,
      engagement: fallbackMeme.engagement
    });
    
    return fallbackMeme;
  }, [memes, currentMeme]);

  // Initialize memes
  React.useEffect(() => {
    if (memes.length > 0 && !currentMeme) {
      console.log('Initializing first meme with engagement data');
      const firstMeme = propCurrentMeme || getWeightedRandomMeme();
      console.log('First meme:', {
        id: firstMeme.id,
        engagement: firstMeme.engagement
      });
      
      setCurrentMeme(firstMeme);
      onMemeChange(firstMeme);
      
      const secondMeme = getWeightedRandomMeme();
      console.log('Next meme:', {
        id: secondMeme.id,
        engagement: secondMeme.engagement
      });
      setNextMeme(secondMeme);
    }
  }, [memes, propCurrentMeme, getWeightedRandomMeme, onMemeChange]);

  const transitionToNextMeme = React.useCallback(async () => {
    if (!nextMeme) return;
    
    console.log('Transitioning to next meme with engagement:', {
      id: nextMeme.id,
      engagement: nextMeme.engagement
    });
    
    setCurrentMeme(nextMeme);
    onMemeChange(nextMeme);
    
    const newNextMeme = getWeightedRandomMeme();
    console.log('New next meme with engagement:', {
      id: newNextMeme.id,
      engagement: newNextMeme.engagement
    });
    setNextMeme(newNextMeme);
  }, [nextMeme, getWeightedRandomMeme, onMemeChange]);

  React.useEffect(() => {
    setIsMobile(!!window.Telegram?.WebApp);
  }, []);

  const handleSwipe = async (direction) => {
    if (isAnimating || !currentMeme) return;
    
    console.log('Handling swipe:', direction);
    console.log('Current meme before swipe:', {
      id: currentMeme.id,
      engagement: currentMeme.engagement
    });
    
    setIsAnimating(true);
    setLastSwipe(direction);
  
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

      // Update current meme's engagement data with response
      if (data.data?.meme?.engagement) {
        setCurrentMeme(prev => ({
          ...prev,
          engagement: data.data.meme.engagement
        }));
      }
    } catch (error) {
      console.error('Interaction error:', error);
    } finally {
      // Transition to next meme after updating engagement
      transitionToNextMeme();
      
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