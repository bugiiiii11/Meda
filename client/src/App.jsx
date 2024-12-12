//App.jsx
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
import dummyMemes from './data/dummyMemes';
import { priceService } from './services/priceService';
import { ENDPOINTS, getHeaders } from './config/api';

console.log('App Environment:', {
  nodeEnv: process.env.NODE_ENV,
  viteEnv: import.meta.env.VITE_ENV,
  apiUrl: import.meta.env.VITE_API_URL,
  botUsername: import.meta.env.VITE_BOT_USERNAME
});

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
  const [currentMeme, setCurrentMeme] = useState(dummyMemes[0]);
  const [initError, setInitError] = useState(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleMemeChange = (meme) => {
    console.log('Changing meme to:', meme);
    setCurrentMeme(meme);
  };

  // In App.jsx, find the useEffect for initialization
  useEffect(() => {
    async function initializeApp() {
      console.log('App Environment:', {
        nodeEnv: import.meta.env.NODE_ENV,
        viteEnv: import.meta.env.VITE_ENV,
        apiUrl: import.meta.env.VITE_API_URL,
        botUsername: import.meta.env.VITE_BOT_USERNAME
      });
  
      try {
        // Initialize price service
        const priceServiceResult = await priceService.initializeData();
        console.log('Price service initialized:', priceServiceResult);
  
        // Check if running in Telegram WebApp
        if (window.Telegram?.WebApp) {
          console.log('Telegram WebApp detected');
          
          WebApp.ready();
          WebApp.expand();
          
          // Debug Telegram environment
          console.log('Telegram WebApp Environment:', {
            isTelegram: true,
            initData: window.Telegram.WebApp.initData,
            user: window.Telegram.WebApp.initDataUnsafe?.user,
            version: window.Telegram.WebApp.version,
            platform: window.Telegram.WebApp.platform,
          });
  
          // Get Telegram user data
          const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
        console.log('Telegram User Data:', tgUser);

        if (!tgUser) {
          console.warn('No Telegram user data available');
          if (import.meta.env.VITE_ENV === 'development') {
            const mockUser = {
              telegramId: 'test123',
              username: 'testUser',
              firstName: 'Test',
              lastName: 'User'
            };
            setUserData(mockUser);
            console.log('Using mock user:', mockUser);
          } else {
            console.error('No Telegram user data in production!');
            setInitError('Failed to get Telegram user data');
            return;
          }
        } else {
          try {
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
            
            console.log('User creation response:', {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries())
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error('Error response:', errorText);
              throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
          
            const userData = await response.json();
            if (userData.success) {
              setUserData(userData.data);
            } else {
              throw new Error(userData.error || 'Failed to initialize user');
            }
          } catch (error) {
            console.error('User initialization error:', error);
            setInitError(`User initialization failed: ${error.message}`);
            return;
          }
        }
      } else {
        console.log('Not running in Telegram WebApp');
        if (import.meta.env.VITE_ENV !== 'production') {
          // Use mock data in development
          setUserData({
            telegramId: 'test123',
            username: 'testUser',
            firstName: 'Test',
            lastName: 'User'
          });
        } else {
          setInitError('This app must be run within Telegram');
          return;
        }
      }

      // Test backend connectivity
      try {
        const response = await fetch(ENDPOINTS.interactions.debug);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        await response.json();
      } catch (error) {
        console.error('Backend connectivity test failed:', error);
        setInitError('Failed to connect to backend');
        return;
      }

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
  return <LoadingScreen error={initError} />;
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
                  memes={dummyMemes}
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