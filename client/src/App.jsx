//App.jsx
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

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#1a1b1e] flex flex-col items-center justify-between p-0 overflow-hidden">
    <div className="w-full flex-1 flex items-center justify-center p-0">
      <img
        src="/loading.png"
        alt="Loading"
        className="w-full h-auto block m-0 p-0"
        onError={(e) => {
          console.error('Loading image error:', e);
          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
        }}
      />
    </div>
    <div className="w-full px-6 mb-20">
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 animate-load-progress" />
      </div>
      <p className="text-gray-400 mt-4 text-center text-lg">Loading market data...</p>
    </div>
  </div>
);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('memes');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentMeme, setCurrentMeme] = useState(null);
  const [memes, setMemes] = useState([]);
  const [initError, setInitError] = useState(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [userData, setUserData] = useState(null);

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
          console.log('Telegram User Data:', tgUser);
    
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

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (!isLoading && !initError) {
        fetchMemes();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [isLoading, initError]);

  if (initError) {
    return (
      <div className="fixed inset-0 bg-[#1a1b1e] flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl mb-2">Failed to initialize app</h2>
          <p>{initError}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="fixed inset-0 bg-[#1a1b1e] overflow-hidden">
      {activeTab === 'memes' ? (
        <>
          <div className="fixed top-0 left-0 right-0 z-[70]">
            <div className="w-full bg-[#121214] py-4">
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
        />
      )}
      <div className="fixed bottom-0 left-0 right-0 z-[60]">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;