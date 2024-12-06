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

  useEffect(() => {
    async function initializeApp() {
      console.log('Initializing app...');
      try {
        // Initialize Telegram WebApp
        if (window.Telegram?.WebApp) {
          console.log('Telegram WebApp detected');
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();
        
          // Add detailed WebApp logging
          const webAppData = window.Telegram.WebApp.initData;
          const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
          
          console.log('Full WebApp data:', {
            initData: webAppData,
            platform: window.Telegram.WebApp.platform,
            version: window.Telegram.WebApp.version,
            colorScheme: window.Telegram.WebApp.colorScheme
          });
          
          console.log('Telegram user data:', tgUser);
        
          if (tgUser) {
            try {
              console.log('Initializing user with Telegram data:', {
                id: tgUser.id,
                username: tgUser.username,
                firstName: tgUser.first_name,
                lastName: tgUser.last_name,
                languageCode: tgUser.language_code
              });
        
              const response = await fetch(`${ENDPOINTS.users.create}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Telegram-Init-Data': webAppData || ''
                },
                body: JSON.stringify({
                  telegramId: tgUser.id.toString(),
                  username: tgUser.username || `user${tgUser.id.toString().slice(-4)}`,
                  firstName: tgUser.first_name,
                  lastName: tgUser.last_name
                })
              });

              const data = await response.json();
              console.log('User initialization response:', data);
        
              if (data.success) {
                console.log('User successfully initialized:', data.data);
                setUserData(data.data);
                setIsTelegram(true);
              } else {
                console.error('User initialization failed:', data.error);
              }
            } catch (userError) {
              console.error('User initialization error:', userError);
              console.error('Error details:', {
                name: userError.name,
                message: userError.message,
                stack: userError.stack
              });
            }
          } else {
            console.warn('No Telegram user data available');
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
  }d

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