
/**
 * CORS Configuration for Sagebright Backend
 * 
 * This module configures CORS settings for the Sagebright API.
 */

const cors = require('cors');

// Define allowed origins
const allowedOrigins = [
  'https://sagebright-auth-update.lovable.app', 
  'https://app.sagebright.ai',
  'http://localhost:5173',  // For local development
  // Add any other domains that need access here
];

// Configure CORS options with origin validation and credentials support
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      // Origin is allowed
      callback(null, true);
    } else {
      // Origin is not allowed
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cache-Control'],
  maxAge: 86400 // Cache preflight requests for 24 hours
};

// Create middleware instances
const corsMiddleware = cors(corsOptions);
const corsPreflight = cors(corsOptions);

module.exports = {
  corsMiddleware,
  corsPreflight,
  allowedOrigins
};
