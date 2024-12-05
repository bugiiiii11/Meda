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
import { ENDPOINTS } from './config/api';


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

  const initializeUser = async () => {
    try {
      // Ensure WebApp is properly initialized
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
  
        // Get user data from Telegram
        const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
        console.log('Raw Telegram User:', tgUser);
  
        if (tgUser) {
          const userData = {
            telegramId: tgUser.id.toString(),
            username: tgUser.username || `user${tgUser.id.toString().slice(-4)}`,
            firstName: tgUser.first_name,
            lastName: tgUser.last_name
          };
  
          console.log('Sending user data to backend:', userData);
  
          const response = await fetch(`${ENDPOINTS.users.create}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Telegram-Init-Data': window.Telegram.WebApp.initData || '',
            },
            body: JSON.stringify(userData)
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log('Server response:', data);
  
          if (data.success) {
            setUserData(data.data);
          }
        }
      } else if (process.env.NODE_ENV === 'development') {
        // Development fallback
        setUserData({
          id: 'test123',
          username: 'testUser',
          firstName: 'Test',
          lastName: 'User'
        });
      } else {
        console.log('No Telegram WebApp found and not in development mode');
      }
    } catch (error) {
      console.error('User initialization error:', error);
    }
  };

  useEffect(() => {
    async function initializeApp() {
      console.log('Initializing app...');
      try {
        if (window.Telegram?.WebApp) {
          WebApp.ready();
          WebApp.expand();
  
          // Get and log Telegram user data
          const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
          console.log('Telegram User Data:', tgUser);
  
          if (tgUser) {
            try {
              const response = await fetch(`${ENDPOINTS.users.create}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Telegram-Init-Data': window.Telegram.WebApp.initData || '',
                },
                body: JSON.stringify({
                  telegramId: tgUser.id.toString(),
                  username: tgUser.username || `user${tgUser.id.toString().slice(-4)}`,
                  firstName: tgUser.first_name,
                  lastName: tgUser.last_name
                })
              });
  
              const userData = await response.json();
              console.log('User initialization response:', userData);
              if (userData.success) {
                setUserData(userData.data);
              }
            } catch (userError) {
              console.error('User initialization error:', userError);
            }
          }
        }
  
        // Test backend connectivity
        try {
          const response = await fetch(ENDPOINTS.debug || `${ENDPOINTS.base}/health`);
          const data = await response.json();
          console.log('Backend health check:', data);
  
          const testResponse = await fetch(ENDPOINTS.interactions.debug);
          console.log('Interaction endpoint test:', await testResponse.json());
        } catch (error) {
          console.error('Backend connectivity test failed:', error);
        }
  
        // Initialize price service
        const priceServiceResult = await priceService.initializeData();
        console.log('Price service initialized:', priceServiceResult);
  
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
