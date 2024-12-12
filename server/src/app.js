//server/src/app.js
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const app = express();


// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://fynder-2h5q.vercel.app',
      'https://fynder-production.up.railway.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    // Allow requests with no origin (like mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Temporarily allow all origins for testing
    }
  },
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

/*
// Basic security headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
  next();
});
*/

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add after CORS middleware
app.use((req, res, next) => {
  console.log('Request headers:', req.headers);
  console.log('Telegram data:', req.headers['telegram-web-app-data']);
  next();
});

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (['POST', 'PUT'].includes(req.method)) {
    console.log('Request body:', req.body);
  }
  next();
});

// Basic routes
app.get('/', (req, res) => {
  res.json({ message: 'CryptoMeme API Server', status: 'online' });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
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

// API routes
app.use('/api/memes', memeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/coingecko', priceRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.get('/debug/env', (req, res) => {
    res.json({
      nodeEnv: process.env.NODE_ENV,
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not Set',
      telegramToken: process.env.TELEGRAM_BOT_TOKEN ? 'Set' : 'Not Set',
      port: process.env.PORT || 3001
    });
  });
}

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
    path: req.originalUrl
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.body
  });
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? {
      stack: err.stack,
      ...err
    } : undefined
  });
});

module.exports = app;