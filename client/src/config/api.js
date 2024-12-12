// client/src/config/api.js
const BASE_URL = import.meta.env.VITE_ENV === 'production'
  ? 'https://fynder-production.up.railway.app'
  : 'http://localhost:3001';

// Keep the makeRequest helper
const makeRequest = async (url, options = {}) => {
  console.log(`Making request to: ${url}`, options);
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  const data = await response.json();
  console.log('Response:', data);
  return data;
};

// Update environment logging
console.log('API Configuration:', {
  environment: import.meta.env.NODE_ENV,
  viteEnv: import.meta.env.VITE_ENV,
  baseUrl: BASE_URL,
  isTelegram: !!window.Telegram?.WebApp,
  endpoints: {
    interactionsUpdate: `${BASE_URL}/api/interactions/update`,
    usersCreate: `${BASE_URL}/api/users/create`,
    leaderboard: `${BASE_URL}/api/interactions/leaderboard`
  }
});

export const ENDPOINTS = {
  base: BASE_URL,
  interactions: {
    update: `${BASE_URL}/api/interactions/update`,
    leaderboard: `${BASE_URL}/api/interactions/leaderboard`,
    debug: `${BASE_URL}/api/interactions/debug`
  },
  memes: {
    withEngagement: `${BASE_URL}/api/memes/withEngagement`,
    create: `${BASE_URL}/api/memes/create`,
    next: `${BASE_URL}/api/memes/next`,
    interact: `${BASE_URL}/api/memes/interact`
  },
  tasks: {
    create: `${BASE_URL}/api/tasks/create`,
    complete: `${BASE_URL}/api/tasks/complete`
  },
  users: {
    create: `${BASE_URL}/api/users/create`,
    get: (telegramId) => `${BASE_URL}/api/users/${telegramId}`,
    points: `${BASE_URL}/api/users/points`
  }
};

export const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };

  console.log('Creating headers, WebApp available:', !!window.Telegram?.WebApp);
  
  if (window.Telegram?.WebApp) {
    const initData = window.Telegram.WebApp.initData;
    console.log('InitData available:', !!initData);
    console.log('InitData:', initData);
    
    headers['X-Telegram-Init-Data'] = initData;
    // Add additional debug headers
    headers['X-Debug-Platform'] = window.Telegram.WebApp.platform;
    headers['X-Debug-Version'] = window.Telegram.WebApp.version;
  }

  console.log('Final headers:', headers);
  return headers;
};

export default ENDPOINTS;