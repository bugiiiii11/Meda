// client/src/config/api.js
const BASE_URL = import.meta.env.NODE_ENV === 'production'
  ? 'https://fynder-production.up.railway.app'
  : 'http://localhost:3001';

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

  // Add request logging
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

console.log('API Configuration:', {
  environment: process.env.NODE_ENV,
  hostname: window.location.hostname,
  baseUrl: BASE_URL,
  isTelegram: !!window.Telegram?.WebApp
});

export const ENDPOINTS = {
  base: BASE_URL,
  interactions: {
    update: `${BASE_URL}/api/interactions/update`,
    leaderboard: `${BASE_URL}/api/interactions/leaderboard`,
    debug: `${BASE_URL}/api/interactions/debug`
  },
  memes: {
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

  // Add debugging for header creation
  console.log('Creating headers, Telegram WebApp available:', !!window.Telegram?.WebApp);

  if (window.Telegram?.WebApp) {
    headers['X-Telegram-Init-Data'] = window.Telegram.WebApp.initData || '';
    console.log('Added Telegram init data to headers');
  }

  return headers;
};

// Keep this default export
export default ENDPOINTS;