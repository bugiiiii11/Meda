import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemeCard from '../MemeCard/MemeCard';
import { ENDPOINTS, getHeaders } from '../../config/api';

const MemeStack = ({ onMemeChange, userData }) => {
  const [currentMeme, setCurrentMeme] = React.useState(null);
  const [nextMeme, setNextMeme] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [lastSwipe, setLastSwipe] = React.useState(null);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const getNextMeme = React.useCallback(async () => {
    try {
      if (!userData?.telegramId) {
        console.log('No telegram ID available');
        return null;
      }
      
      const response = await fetch(ENDPOINTS.memes.next(userData.telegramId), {
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Next meme data:', data);
      
      if (data.success && data.data) {
        return data.data;
      }
      
      console.log('No meme data received');
      return null;
    } catch (error) {
      console.error('Error fetching next meme:', error);
      return null;
    }
  }, [userData]);

  // Initialize memes
  React.useEffect(() => {
    const initializeMemes = async () => {
      if (!currentMeme && userData?.telegramId) {
        setIsLoading(true);
        try {
          const firstMeme = await getNextMeme();
          if (firstMeme) {
            console.log('Setting initial meme:', firstMeme);
            setCurrentMeme(firstMeme);
            onMemeChange(firstMeme);
            
            const secondMeme = await getNextMeme();
            if (secondMeme) {
              console.log('Setting next meme:', secondMeme);
              setNextMeme(secondMeme);
            }
          }
        } catch (error) {
          console.error('Error initializing memes:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    initializeMemes();
  }, [userData, getNextMeme, onMemeChange]);

  const handleSwipe = async (direction) => {
    if (isAnimating || !currentMeme) return;
    
    setIsAnimating(true);
    setLastSwipe(direction);

    try {
      const action = direction === 'right' ? 'like' : 
                    direction === 'left' ? 'dislike' : 'superlike';

      console.log('Sending interaction:', {
        action,
        memeId: currentMeme.id,
        telegramId: userData?.telegramId
      });

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
          console.log('Setting new next meme:', newNextMeme);
          setNextMeme(newNextMeme);
        } else {
          setNextMeme(null);
        }
      } else {
        // If no next meme, try to fetch one
        const newMeme = await getNextMeme();
        if (newMeme) {
          setCurrentMeme(newMeme);
          onMemeChange(newMeme);
          
          const followingMeme = await getNextMeme();
          if (followingMeme) {
            setNextMeme(followingMeme);
          }
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

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
              x: lastSwipe === 'left' ? -200 : lastSwipe === 'right' ? 200 : 0,
              y: lastSwipe === 'super' ? -200 : 0,
              transition: { duration: 0.2 }
            }}
          >
            <MemeCard
              meme={currentMeme}
              onSwipe={handleSwipe}
              isTop={true}
              userData={userData}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={(event, info) => {
                setIsDragging(false);
                if (!info) return;
                
                const xOffset = info.offset?.x || 0;
                const yOffset = info.offset?.y || 0;
                
                if (Math.abs(yOffset) > 100 && Math.abs(yOffset) > Math.abs(xOffset)) {
                  handleSwipe('super');
                } else if (xOffset > 100) {
                  handleSwipe('right');
                } else if (xOffset < -100) {
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
            <div className={`px-8 py-4 rounded-2xl border-4 border-white shadow-xl backdrop-blur-sm ${
              lastSwipe === 'right' ? 'bg-green-500/90' :
              lastSwipe === 'left' ? 'bg-red-500/90' :
              'bg-blue-500/90'
            }`}>
              <div className="text-4xl font-bold text-white">
                {lastSwipe === 'right' ? 'LIKE' : 
                 lastSwipe === 'left' ? 'NOPE' : 
                 'SUPER'}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemeStack;