
/**
 * CORS Implementation for Express Server
 * 
 * This is an example of how to add the CORS middleware to your Express app
 * Use this as a reference for updating your server.js or app.js file
 */

const express = require('express');
const { corsMiddleware, corsPreflight } = require('./cors-config');

const app = express();

// Apply CORS globally to all routes
app.use(corsMiddleware);

// Handle OPTIONS requests (preflight)
app.options('*', corsPreflight);

// Add CORS debug logging middleware
app.use((req, res, next) => {
  console.log('CORS Request:', {
    origin: req.headers.origin,
    method: req.method,
    path: req.path,
    time: new Date().toISOString()
  });
  next();
});

// Example of your existing route definitions with CORS debugging
app.get('/api/auth/session', (req, res, next) => {
  // Debug log for CORS validation
  console.log('CORS origin received:', req.headers.origin);
  console.log('Session request headers:', JSON.stringify(req.headers, null, 2));
  
  // Continue with your existing handler
  next();
});

// For individual routes that might need CORS (if not applied globally)
// const authRouter = express.Router();
// authRouter.get('/session', corsMiddleware, yourSessionHandler);
// authRouter.post('/login', corsMiddleware, yourLoginHandler);
// app.use('/api/auth', authRouter);

module.exports = app;
