// MemeStack.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemeCard from '../MemeCard/MemeCard';
import { ENDPOINTS } from '../../config/api';

const PixelParticle = ({ color }) => (
  <div className={`w-1 h-1 ${color}`} />
);

const GlitchText = ({ children }) => (
  <motion.div
    animate={{
      x: [-2, 2, -2, 1, -1, 0],
      opacity: [1, 0.8, 1, 0.9, 1],
    }}
    transition={{
      duration: 0.3,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      repeat: 1,
    }}
    className="relative"
  >
    <span className="relative z-10">{children}</span>
    <motion.span
      className="absolute inset-0 text-[#50FA7B] opacity-80"
      animate={{
        x: [-3, 3, -2, 2, 0],
      }}
      transition={{
        duration: 0.2,
        times: [0, 0.25, 0.5, 0.75, 1],
        repeat: 2,
      }}
    >
      {children}
    </motion.span>
  </motion.div>
);

// Initial state declarations
const MemeStack = ({ memes, onMemeChange, currentMeme: propCurrentMeme, userData, superlikeStatus, onSuperlikeUse }) => {
  const [currentMeme, setCurrentMeme] = React.useState(null);
  const [nextMeme, setNextMeme] = React.useState(null);
  const [lastSwipe, setLastSwipe] = React.useState(null);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const currentCardRef = React.useRef(null);

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
    
    // If this is the first selection (no current or next meme), use all memes
    if (!currentMeme && !nextMeme) {
      console.log('Initial meme selection - using all memes');
      const totalWeight = memes.reduce((sum, meme) => sum + (meme.weight || 1), 0);
      let random = Math.random() * totalWeight;
      
      for (const meme of memes) {
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
          
          console.log('Selected initial meme:', {
            id: selectedMeme.id,
            projectName: selectedMeme.projectName,
            engagement: selectedMeme.engagement
          });
          
          return selectedMeme;
        }
      }
      
      // Fallback to first meme if loop completes without selection
      const fallbackMeme = {
        ...memes[0],
        engagement: {
          likes: parseInt(memes[0].engagement?.likes || 0),
          superLikes: parseInt(memes[0].engagement?.superLikes || 0),
          dislikes: parseInt(memes[0].engagement?.dislikes || 0)
        }
      };
      
      console.log('Using fallback meme for initial selection:', {
        id: fallbackMeme.id,
        projectName: fallbackMeme.projectName,
        engagement: fallbackMeme.engagement
      });
      
      return fallbackMeme;
    }
    
    // Filter out both current and next meme IDs
    const currentMemeId = currentMeme?.id;
    const nextMemeId = nextMeme?.id;
    console.log('Filtering out memes:', { currentMemeId, nextMemeId });
    
    const availableMemes = memes.filter(meme => 
      meme.id !== currentMemeId && meme.id !== nextMemeId
    );
    
    console.log('Filtered available memes:', availableMemes.length);
  
    if (availableMemes.length === 0) {
      console.log('No available unique memes, using all memes except current');
      // If no other memes available, at least avoid the current meme
      const fallbackMemes = memes.filter(meme => meme.id !== currentMemeId);
      if (fallbackMemes.length === 0) {
        console.log('Using first meme as last resort');
        return {
          ...memes[0],
          engagement: {
            likes: parseInt(memes[0].engagement?.likes || 0),
            superLikes: parseInt(memes[0].engagement?.superLikes || 0),
            dislikes: parseInt(memes[0].engagement?.dislikes || 0)
          }
        };
      }
      availableMemes.push(...fallbackMemes);
    }
  
    // Calculate total weight for available memes
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
    
    // Fallback to first available meme if needed
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
  }, [memes, currentMeme, nextMeme]);

  // Initialize memes
  React.useEffect(() => {
    if (memes.length > 0 && !currentMeme) {
      console.log('Initializing first meme with engagement data');
      // Remove propCurrentMeme preference to ensure random first meme
      const firstMeme = getWeightedRandomMeme();
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
  }, [memes, getWeightedRandomMeme, onMemeChange]);

  const transitionToNextMeme = React.useCallback(() => {
    if (!nextMeme) return;
    
    console.log('Transitioning to next meme with engagement:', nextMeme);
    
    // Set current meme to next meme
    setCurrentMeme(nextMeme);
    onMemeChange(nextMeme);
    
    // Slight delay before setting next meme to prevent blinking
    setTimeout(() => {
      const newNextMeme = getWeightedRandomMeme();
      console.log('New next meme with engagement:', newNextMeme);
      setNextMeme(newNextMeme);
    }, 200); // Delay matches the exit animation duration
    
  }, [nextMeme, getWeightedRandomMeme, onMemeChange]);

  React.useEffect(() => {
    setIsMobile(!!window.Telegram?.WebApp);
  }, []);

  const handleSwipe = async (direction) => {
    if (isAnimating || !currentMeme) return;
    
    // Check superlike availability
    if (direction === 'super') {
        console.log('Attempting superlike with status:', superlikeStatus);
        if (!superlikeStatus.canSuperlike) {
            console.log('Superlike blocked: No superlikes remaining');
            return;
        }
    }
    
    console.log('Processing swipe:', {
        direction,
        memeId: currentMeme.id,
        userId: userData?.telegramId,
        remainingSuperlikes: superlikeStatus.remainingSuperlikes
    });

    console.log('Current meme before swipe:', {
        id: currentMeme.id,
        engagement: currentMeme.engagement
    });
    
    setIsAnimating(true);
    setLastSwipe(direction);

    try {
        let response;
        
        if (direction === 'super') {
            console.log('Making superlike API request for meme:', currentMeme.id);
            // First use superlike endpoint to handle limits
            response = await fetch(ENDPOINTS.superlikes.use, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': window.location.origin,
                    'X-Telegram-Init-Data': window.Telegram?.WebApp?.initData || ''
                },
                body: JSON.stringify({
                    telegramId: userData?.telegramId,
                    memeId: currentMeme.id
                })
            });

            const superlikeData = await response.json();
            console.log('Superlike API response:', superlikeData);

            if (superlikeData.success) {
                // Then record the interaction as before
                response = await fetch(ENDPOINTS.interactions.update, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Origin': window.location.origin,
                        'X-Telegram-Init-Data': window.Telegram?.WebApp?.initData || ''
                    },
                    body: JSON.stringify({
                        action: 'superlike',
                        memeId: currentMeme.id,
                        telegramId: userData?.telegramId,
                        username: userData?.username
                    })
                });

                // Update superlike status after successful use
                await onSuperlikeUse(userData?.telegramId);
            } else {
                throw new Error(superlikeData.error || 'Superlike failed');
            }
        } else {
            console.log('Making regular interaction API request:', {
                action: direction === 'right' ? 'like' : 'dislike',
                memeId: currentMeme.id
            });
            // Regular like/dislike
            const action = direction === 'right' ? 'like' : 'dislike';
            response = await fetch(ENDPOINTS.interactions.update, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': window.location.origin,
                    'X-Telegram-Init-Data': window.Telegram?.WebApp?.initData || ''
                },
                body: JSON.stringify({
                    action,
                    memeId: currentMeme.id,
                    telegramId: userData?.telegramId,
                    username: userData?.username
                })
            });
        }

        const data = await response.json();
        console.log('Final API response:', data);

        if (!data.success) {
            console.error('API request failed:', data.error);
            throw new Error(data.error || 'Interaction failed');
        }

        // Animation timing based on swipe type
        const animationDuration = direction === 'super' ? 1200 : 700;
        
        // After the indicator animation completes, transition to next meme
        setTimeout(() => {
            setLastSwipe(null);
            transitionToNextMeme();
            setIsAnimating(false);
        }, animationDuration);

    } catch (error) {
        console.error('Interaction error:', error);
        // Reset animation state in case of error
        setIsAnimating(false);
        setLastSwipe(null);
    }
};

  return (
    <div className="relative max-w-[calc(100vw-32px)] mx-auto aspect-square bg-[#0A0B0F]">
      {/* Background Layer (Next Meme) - Always below */}
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
  
      {/* Top Layer (Current Meme) - With animation */}
      <AnimatePresence mode="sync">
        {currentMeme && (
          <motion.div
            key={currentMeme.id}
            className="absolute inset-0 z-20"
            initial={false}
            animate={{ 
              opacity: isDragging ? 0.5 : 1,
              scale: 1,
              zIndex: 20
            }}
            exit={{ 
              opacity: 0,
              scale: 0.95,
              transition: { 
                duration: 0.2,
                ease: "easeOut"
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
                
                // Bounce back animation
                if (currentCardRef.current?.bounceBack) {
                  currentCardRef.current.bounceBack();
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
  
      {/* Swipe Indicator Overlay - Advanced Gaming Theme */}
      <AnimatePresence>
        {lastSwipe && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {lastSwipe === 'right' && (
              <>
                {/* Enhanced Corner Effects */}
                <motion.div className="absolute top-4 left-4">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={`corner-effect-${i}`}
                      className="absolute w-16 h-16"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 2],
                        rotate: [0, 90, 180]
                      }}
                      transition={{
                        duration: 0.7,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                    >
                      <div className="w-full h-full border-t-4 border-l-4 border-[#50FA7B] rounded-tl-lg" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Thicker Energy Lines */}
                <motion.div className="absolute inset-0">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={`energy-line-${i}`}
                      className="absolute h-2 bg-gradient-to-r from-[#50FA7B] to-transparent"
                      style={{
                        left: 0,
                        top: `${(i / 12) * 100}%`,
                        width: '100%',
                        transform: `rotate(${(i * 30)}deg)`,
                        transformOrigin: 'center'
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 0.7, 0],
                        scale: [0, 1, 1],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.04,
                      }}
                    />
                  ))}
                </motion.div>

                {/* Main Power Up Indicator with enhanced glow */}
                <motion.div 
                  className="px-8 py-4 rounded-2xl border-4 border-[#50FA7B] bg-black/80 backdrop-blur-sm"
                  initial={{ scale: 0, y: 50 }}
                  animate={{ 
                    scale: 1,
                    y: 0,
                    boxShadow: [
                      '0 0 20px rgba(80, 250, 123, 0.4)',
                      '0 0 40px rgba(80, 250, 123, 0.6)',
                      '0 0 60px rgba(80, 250, 123, 0.4)'
                    ]
                  }}
                  transition={{ duration: 0.7 }}
                  exit={{ scale: 0, y: -50, transition: { duration: 0.2 } }}
                >
                  <GlitchText>
                    <div className="font-game-title text-4xl text-white">
                      POWER UP!
                    </div>
                  </GlitchText>
                </motion.div>
              </>
            )}

            {/* Critical Hit - Enhanced Glow and Text Animation */}
            {lastSwipe === 'left' && (
              <>
                {/* Enhanced Red Glow Background */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.6, 0.3, 0.5, 0],
                    background: [
                      'radial-gradient(circle, rgba(255, 85, 85, 0) 0%, rgba(255, 85, 85, 0) 100%)',
                      'radial-gradient(circle, rgba(255, 85, 85, 0.4) 0%, rgba(255, 0, 0, 0.2) 70%)',
                      'radial-gradient(circle, rgba(255, 85, 85, 0) 0%, rgba(255, 85, 85, 0) 100%)',
                    ]
                  }}
                  transition={{ duration: 0.7, times: [0, 0.3, 0.6, 0.8, 1] }}
                />

                {/* Enhanced Critical Hit Indicator */}
                <motion.div 
                  className="px-8 py-4 rounded-2xl border-4 border-[#FF5555] bg-black/80 backdrop-blur-sm"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0.8, 1.1, 1],
                    rotate: [-2, 2, -1, 1, 0],
                    boxShadow: [
                      '0 0 30px rgba(255, 85, 85, 0.5)',
                      '0 0 60px rgba(255, 85, 85, 0.7)',
                      '0 0 40px rgba(255, 85, 85, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 0.6,
                    rotate: {
                      duration: 0.3,
                      repeat: 2,
                      repeatType: "reverse"
                    }
                  }}
                  exit={{ scale: 0, transition: { duration: 0.2 } }}
                >
                  <div className="font-game-title text-4xl text-white relative">
                    <motion.div
                      animate={{
                        x: [-2, 2, -2, 1, -1, 0],
                        scale: [1, 1.05, 1, 1.02, 1]
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: 2,
                        repeatType: "reverse"
                      }}
                    >
                      CRITICAL HIT!
                    </motion.div>
                  </div>
                </motion.div>
              </>
            )}

            {/* Legendary - Enhanced Matrix Rain and Light Effects */}
            {lastSwipe === 'super' && (
              <>
                {/* Enhanced Matrix Rain */}
                <motion.div className="absolute inset-0 overflow-hidden">
                  {[...Array(50)].map((_, i) => (
                    <motion.div
                      key={`matrix-${i}`}
                      className="absolute text-sm font-mono text-[#4B7BF5]"
                      initial={{
                        x: `${Math.random() * 100}%`,
                        y: -20,
                        opacity: 0,
                      }}
                      animate={{
                        y: ['0%', '120%'],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.02,
                        ease: 'linear',
                      }}
                    >
                      {String.fromCharCode(0x30A0 + Math.random() * 96)}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced Light Effects */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0.4, 0.6, 0],
                    background: [
                      'radial-gradient(circle at center, rgba(75, 123, 245, 0.4) 0%, rgba(138, 43, 226, 0.2) 30%, transparent 70%)',
                      'radial-gradient(circle at center, rgba(75, 123, 245, 0.6) 0%, rgba(138, 43, 226, 0.4) 40%, transparent 80%)',
                      'radial-gradient(circle at center, rgba(75, 123, 245, 0.3) 0%, rgba(138, 43, 226, 0.2) 30%, transparent 70%)',
                    ]
                  }}
                  transition={{ duration: 1.2, times: [0, 0.3, 0.6, 0.8, 1] }}
                />

                {/* Floating Particles */}
                <motion.div className="absolute inset-0">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-2 h-2 rounded-full bg-[#4B7BF5]"
                      initial={{
                        x: "50%",
                        y: "50%",
                        scale: 0,
                        opacity: 0
                      }}
                      animate={{
                        x: `${50 + (Math.random() * 100 - 50)}%`,
                        y: `${50 + (Math.random() * 100 - 50)}%`,
                        scale: [0, 1.5, 0],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        duration: 1,
                        delay: i * 0.05,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>

                {/* Main Legendary Indicator */}
                <motion.div 
                  className="px-8 py-4 rounded-2xl border-4 border-[#4B7BF5] bg-black/80 backdrop-blur-sm"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0.9, 1.1, 1],
                    boxShadow: [
                      '0 0 30px rgba(75, 123, 245, 0.5)',
                      '0 0 60px rgba(138, 43, 226, 0.7)',
                      '0 0 90px rgba(75, 123, 245, 0.5)'
                    ]
                  }}
                  transition={{ duration: 1.2 }}
                  exit={{ scale: 0, transition: { duration: 0.3 } }}
                >
                  <div className="font-game-title text-5xl text-white">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        textShadow: [
                          '0 0 10px rgba(255, 255, 255, 0.5)',
                          '0 0 20px rgba(255, 255, 255, 0.7)',
                          '0 0 10px rgba(255, 255, 255, 0.5)'
                        ]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      LEGENDARY!
                    </motion.div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemeStack;