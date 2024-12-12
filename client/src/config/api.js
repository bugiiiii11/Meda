// config/api.js
const BASE_URL = import.meta.env.VITE_ENV === 'production'
  ? 'https://fynder-production.up.railway.app'
  : 'http://localhost:3001';

export const ENDPOINTS = {
  base: BASE_URL,
  interactions: {
    update: `${BASE_URL}/api/interactions/update`,
    leaderboard: `${BASE_URL}/api/interactions/leaderboard`,
    debug: `${BASE_URL}/api/interactions/debug`
  },
  memes: {
    create: `${BASE_URL}/api/memes/create`,
    next: (telegramId) => `${BASE_URL}/api/memes/next/${telegramId}`,
    interact: `${BASE_URL}/api/memes/interact`
  },
  users: {
    create: `${BASE_URL}/api/users/create`,
    get: (telegramId) => `${BASE_URL}/api/users/${telegramId}`,
    stats: (telegramId) => `${BASE_URL}/api/users/${telegramId}/stats`
  }
};

export const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };

  if (window.Telegram?.WebApp) {
    const initData = window.Telegram.WebApp.initData;
    if (initData) {
      headers['X-Telegram-Init-Data'] = initData;
    }
  }

  return headers;
};

export default ENDPOINTS;