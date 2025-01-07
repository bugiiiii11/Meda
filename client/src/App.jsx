//client/src/App.jsx
import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';
import TopBar from './components/TopBar/TopBar';
import MemeStack from './components/MemeStack/MemeStack';
import Navigation from './components/Navigation/Navigation';
import DetailsPage from './components/DetailsPage/DetailsPage';
import TasksPage from './components/TasksPage';
import ProfilePage from './components/ProfilePage';
import RanksPage from './components/RanksPage';
import { ENDPOINTS, getHeaders } from './config/api';
import { priceService } from './services/priceService';
import dummyMemes from './data/dummyMemes';
import './styles/globals.css';

//last update LoadingScreen to prevent blinking
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#0A0B0F] flex flex-col items-center justify-between p-0 overflow-hidden">
    {/* Background particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#4B7BF5] rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: 0.3
          }}
        />
      ))}
    </div>

    {/* Main content */}
    <div className="w-full flex-1 flex items-center justify-center p-0 relative">
      <img
        src="/loading.png"
        alt="Loading"
        className="w-full h-auto block m-0 p-0"
        style={{
          opacity: 1,
          filter: 'none'
        }}
        onError={(e) => {
          console.error('Loading image error:', e);
          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
        }}
      />
    </div>

    {/* Loading bar section */}
    <div className="relative w-full px-6 mb-20">
      <div className="w-full h-3 bg-[#1A1B2E] rounded-full overflow-hidden border border-white/5">
        <div className="relative h-full bg-gradient-to-r from-[#4B7BF5] to-[#8A2BE2] animate-load-progress">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-progress-shine" />
        </div>
      </div>
      <p className="font-game-mono text-gray-400 mt-4 text-center">
        Initializing Battle System...
      </p>
    </div>
  </div>
);

function App() {
  // State declarations
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('memes');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentMeme, setCurrentMeme] = useState(null);
  const [memes, setMemes] = useState([]);
  const [initError, setInitError] = useState(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [userData, setUserData] = useState(null);
  const [superlikeStatus, setSuperlikeStatus] = useState({
    canSuperlike: true,
    remainingSuperlikes: 3,
    nextResetIn: 24
  });

  const handleUserDataUpdate = async (telegramId) => {
    if (!telegramId) return;
    
    try {
      const response = await fetch(
        `${ENDPOINTS.users.get(telegramId)}`,
        { headers: getHeaders() }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch updated user data');
      }

      const data = await response.json();
      if (data.success) {
        // Only update if we have new data and it's different from current
        if (data.data && JSON.stringify(data.data) !== JSON.stringify(userData)) {
          setUserData(data.data);
        }
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  // Function to fetch superlike status
  const fetchSuperlikeStatus = async (telegramId) => {
    if (!telegramId) return;
    
    try {
      console.log('Fetching superlike status for user:', telegramId);
      const response = await fetch(ENDPOINTS.superlikes.status(telegramId), {
        headers: getHeaders()
      });
      
      const data = await response.json();
      console.log('Superlike status response:', data);
      
      if (data.success) {
        setSuperlikeStatus(data.data);
      }
    } catch (error) {
      console.error('Error fetching superlike status:', error);
    }
  };

  const handleMemeChange = (meme) => {
    console.log('Changing meme to:', meme);
    setCurrentMeme(meme);
  };

  const fetchMemes = async () => {
    try {
      console.log('Fetching memes with engagement data...');
      const response = await fetch(ENDPOINTS.memes.withEngagement, {
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received engagement data:', data);
      
      if (data.success && Array.isArray(data.data)) {
        // Merge backend engagement data with frontend meme data
        const memesWithEngagement = dummyMemes.map(frontendMeme => {
          // Find matching backend meme data
          const backendMeme = data.data.find(m => m.id === frontendMeme.id);
          
          return {
            ...frontendMeme,
            engagement: backendMeme ? {
              likes: parseInt(backendMeme.engagement?.likes || 0),
              superLikes: parseInt(backendMeme.engagement?.superLikes || 0),
              dislikes: parseInt(backendMeme.engagement?.dislikes || 0)
            } : {
              likes: 0,
              superLikes: 0,
              dislikes: 0
            }
          };
        });
        
        console.log('Processed memes with engagement:', memesWithEngagement);
        setMemes(memesWithEngagement);
        
        // Set initial current meme if none selected
        if (!currentMeme && memesWithEngagement.length > 0) {
          setCurrentMeme(memesWithEngagement[0]);
        }
      } else {
        throw new Error('Invalid memes data received');
      }
    } catch (error) {
      console.error('Error fetching memes:', error);
      // On error, use dummyMemes with zero engagement as fallback
      const fallbackMemes = dummyMemes.map(meme => ({
        ...meme,
        engagement: { likes: 0, superLikes: 0, dislikes: 0 }
      }));
      setMemes(fallbackMemes);
      if (!currentMeme && fallbackMemes.length > 0) {
        setCurrentMeme(fallbackMemes[0]);
      }
    }
  };

  useEffect(() => {
    async function initializeApp() {
      console.log('App Environment:', {
        nodeEnv: import.meta.env.NODE_ENV,
        viteEnv: import.meta.env.VITE_ENV,
        apiUrl: import.meta.env.VITE_API_URL,
        botUsername: import.meta.env.VITE_BOT_USERNAME
      });
    
      try {
        setMemes(dummyMemes.map(meme => ({
          ...meme,
          engagement: { likes: 0, superLikes: 0, dislikes: 0 }
        })));
    
        await priceService.initializeData();
        
        if (window.Telegram?.WebApp) {
          console.log('Telegram WebApp detected');
          WebApp.ready();
          WebApp.expand();
          
          const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
          console.log('Telegram User Data:', {
            user: tgUser,
            startParam: window.Telegram?.WebApp?.initDataUnsafe?.start_param,  // This is the referral code
            fullInitData: window.Telegram?.WebApp?.initDataUnsafe
          });
    
          if (!tgUser) {
            if (import.meta.env.VITE_ENV === 'development') {
              const mockUser = {
                telegramId: 'test123',
                username: 'testUser',
                firstName: 'Test',
                lastName: 'User'
              };
              setUserData(mockUser);
            } else {
              throw new Error('No Telegram user data in production');
            }
          } else {
            // Get referral ID from URL if it exists
            const urlParams = new URLSearchParams(window.location.search);
            const referralId = urlParams.get('ref');
            console.log('Referral ID from URL:', referralId);
    
            // Create or update user with referral info
            const response = await fetch(ENDPOINTS.users.create, {
              method: 'POST',
              headers: {
                ...getHeaders(),
                'Origin': window.location.origin
              },
              body: JSON.stringify({
                telegramId: tgUser.id.toString(),
                username: tgUser.username || `user${tgUser.id.toString().slice(-4)}`,
                firstName: tgUser.first_name,
                lastName: tgUser.last_name,
                referredBy: referralId // Include referral ID if exists
              })
            });
    
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const userData = await response.json();
            
            if (userData.success) {
              // If there was a referral, process it
              if (referralId) {
                try {
                  console.log('Processing referral for user:', tgUser.id.toString());
                  const redeemResponse = await fetch(`${ENDPOINTS.base}/api/referrals/redeem`, {
                    method: 'POST',
                    headers: {
                      ...getHeaders(),
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      referralCode: referralId,
                      newUserTelegramId: tgUser.id.toString(),
                      username: tgUser.username || `user${tgUser.id.toString().slice(-4)}`
                    })
                  });
                  
                  const redeemData = await redeemResponse.json();
                  console.log('Referral redemption result:', redeemData);
    
                  // Fetch updated user data after referral processing
                  const updatedUserResponse = await fetch(
                    ENDPOINTS.users.get(tgUser.id.toString()),
                    { headers: getHeaders() }
                  );
                  
                  if (updatedUserResponse.ok) {
                    const updatedUserData = await updatedUserResponse.json();
                    if (updatedUserData.success) {
                      setUserData(updatedUserData.data);
                    }
                  }
                } catch (error) {
                  console.error('Error processing referral:', error);
                }
              } else {
                // No referral, just set the user data
                setUserData(userData.data);
              }
            } else {
              throw new Error(userData.error || 'Failed to initialize user');
            }
          }
        } else {
          if (import.meta.env.VITE_ENV !== 'production') {
            setUserData({
              telegramId: 'test123',
              username: 'testUser',
              firstName: 'Test',
              lastName: 'User'
            });
          } else {
            throw new Error('This app must be run within Telegram');
          }
        }
    
        await fetchMemes();
    
      } catch (error) {
        console.error('Initialization error:', error);
        setInitError(error.message);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    }

    initializeApp();
  }, []);

  // Effect for fetching memes periodically
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (!isLoading && !initError) {
        fetchMemes();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [isLoading, initError]);

  // Effect for fetching initial superlike status
  useEffect(() => {
    if (userData?.telegramId) {
      fetchSuperlikeStatus(userData.telegramId);
    }
  }, [userData?.telegramId]);

  if (initError) {
    return (
      <div className="fixed inset-0 bg-[#0A0B0F] flex items-center justify-center">
        <div className="relative">
          {/* Error glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5555]/20 to-[#CC4444]/20 rounded-xl blur-xl"></div>
          
          {/* Error content */}
          <div className="relative bg-gradient-to-r from-[#2A1B3D] to-[#1A1B2E] border border-[#FF5555]/20 
            rounded-xl p-6 text-center">
            <h2 className="font-game-title text-2xl text-[#FF5555] mb-3">Battle System Error</h2>
            <p className="font-game-mono text-red-400">{initError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="fixed inset-0 bg-[#0A0B0F] overflow-hidden">
      {activeTab === 'memes' ? (
        <>
        <div className="fixed top-0 left-0 right-0 z-[70]">
          <div className="w-full bg-[#0A0B0F] py-4">
            <TopBar
              meme={currentMeme}
              onDetailsClick={() => setIsDetailsOpen(!isDetailsOpen)}
              isDetailsOpen={isDetailsOpen}
            />
          </div>
        </div>
          <div className="absolute inset-0 pt-[240px] pb-[80px]">
            <div className="h-full flex items-start justify-center">
              <div className="w-full px-4">
                <MemeStack
                  memes={memes}
                  onMemeChange={handleMemeChange}
                  currentMeme={currentMeme}
                  userData={userData}
                  superlikeStatus={superlikeStatus}
                  onSuperlikeUse={fetchSuperlikeStatus}
                />
              </div>
            </div>
          </div>
          <DetailsPage isOpen={isDetailsOpen} meme={currentMeme} />
        </>
      ) : activeTab === 'tasks' ? (
        <TasksPage 
          userData={userData} 
          onUserDataUpdate={() => handleUserDataUpdate(userData?.telegramId)}
        />
      ) : activeTab === 'ranks' ? (
        <RanksPage userData={userData} />
      ) : (
        <ProfilePage 
          userData={userData} 
          onUserDataUpdate={() => handleUserDataUpdate(userData?.telegramId)}
          superlikeStatus={superlikeStatus}
        />
      )}
      <div className="fixed bottom-0 left-0 right-0 z-[60]">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;