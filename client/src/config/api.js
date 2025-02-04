// config/api.js
const BASE_URL = import.meta.env.VITE_API_URL;

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
  users: {
    whitelist: `${BASE_URL}/api/users/whitelist`,
    create: `${BASE_URL}/api/users/create`,
    get: (telegramId) => `${BASE_URL}/api/users/${telegramId}`,
    points: `${BASE_URL}/api/users/points`
  },
  superlikes: {
    status: (telegramId) => `${BASE_URL}/api/superlikes/status/${telegramId}`,
    use: `${BASE_URL}/api/superlikes/use`
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