// server/src/app.js
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const app = express();

// CORS configuration
app.use(cors({
  origin: ['https://fynder-2h5q.vercel.app', 'https://fynder-production.up.railway.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Telegram-Init-Data',
    'X-Debug-Version',
    'X-Debug-Platform'
  ]
}));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request headers:', {
    origin: req.headers.origin,
    'telegram-data': req.headers['x-telegram-init-data']
  });
  if (['POST', 'PUT'].includes(req.method)) {
    console.log('Request body:', req.body);
  }
  next();
});

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'CryptoMeme API Server', 
    status: 'online',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    }
  });
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/favicon.ico'));
});

// Import routes
const memeRoutes = require('./routes/memeRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const referralRoutes = require('./routes/referralRoutes');
const priceRoutes = require('./routes/priceRoutes');
const superLikesRoutes = require('./routes/superLikesRoutes');

// API routes with versioning prefix
const API_PREFIX = '/api';

app.use(`${API_PREFIX}/memes`, memeRoutes);
app.use(`${API_PREFIX}/tasks`, taskRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/interactions`, interactionRoutes);
app.use(`${API_PREFIX}/referrals`, referralRoutes);
app.use(`${API_PREFIX}/coingecko`, priceRoutes);
app.use(`${API_PREFIX}`, superLikesRoutes);
app.use(`${API_PREFIX}/superlikes`, superLikesRoutes);

// Debug routes for non-production environments
if (process.env.NODE_ENV !== 'production') {
  app.get('/debug/env', (req, res) => {
    res.json({
      nodeEnv: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not Set',
      telegramToken: process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not Set',
      port: process.env.PORT || 3001,
      dbStatus: mongoose.connection.readyState,
      corsOrigins: app.get('corsOrigins')
    });
  });

  // Task system debug endpoints
  app.get('/debug/tasks', async (req, res) => {
    try {
      const Task = require('./models/Task');
      const tasks = await Task.find({});
      res.json({ success: true, count: tasks.length, tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}

// Pre-flight OPTIONS handler
app.options('*', cors());

// Handle OPTIONS requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  const errorResponse = {
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'An unexpected error occurred',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  };

  // Add stack trace and additional details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error = {
      stack: err.stack,
      details: err
    };
  }

  // Log error details
  console.error('Error details:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  
  res.status(err.status || 500).json(errorResponse);
});

module.exports = app;