import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';
import TopBar from './components/TopBar/TopBar';
import ProjectHeader from './components/ProjectHeader/ProjectHeader';
import MemeStack from './components/MemeStack/MemeStack';
import Navigation from './components/Navigation/Navigation';
import DetailsPage from './components/DetailsPage/DetailsPage';
import TasksPage from './components/TasksPage';
import ProfilePage from './components/ProfilePage';
import RanksPage from './components/RanksPage';
import { ENDPOINTS, getHeaders } from './config/api';
import { priceService } from './services/priceService';

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
      console.log('Received memes data:', data);
      
      if (data.success && Array.isArray(data.data)) {
        const memesWithEngagement = data.data.map(meme => ({
          ...meme,
          engagement: {
            likes: parseInt(meme.engagement?.likes || 0),
            superLikes: parseInt(meme.engagement?.superLikes || 0),
            dislikes: parseInt(meme.engagement?.dislikes || 0)
          }
        }));
        
        console.log('Processed memes with engagement:', memesWithEngagement);
        setMemes(memesWithEngagement);
        
        if (!currentMeme && memesWithEngagement.length > 0) {
          setCurrentMeme(memesWithEngagement[0]);
        }
      } else {
        throw new Error('Invalid memes data received');
      }
    } catch (error) {
      console.error('Error fetching memes:', error);
      setInitError(`Failed to load memes: ${error.message}`);
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
                lastName: tgUser.last_name
              })
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const userData = await response.json();
            if (userData.success) {
              setUserData(userData.data);
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
            <div className="w-full bg-[#1a1b1e] py-4">
              <ProjectHeader meme={currentMeme} />
            </div>
          </div>
          <div className="fixed top-[72px] left-0 right-0 z-[60]">
            <div className="w-full bg-[#1a1b1e] border-t border-[#2c2d31]">
              <TopBar
                meme={currentMeme}
                onDetailsClick={() => setIsDetailsOpen(!isDetailsOpen)}
                isDetailsOpen={isDetailsOpen}
              />
            </div>
          </div>
          <div className="absolute inset-0 pt-[190px] pb-[60px]">
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
        <TasksPage userData={userData} />
      ) : activeTab === 'ranks' ? (
        <RanksPage userData={userData} />
      ) : (
        <ProfilePage userData={userData} />
      )}
      <div className="fixed bottom-0 left-0 right-0 z-[60]">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;