import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import errorHandler from './middlewares/error.js';

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'https://borejak-backend.vercel.app',
    'http://localhost:5000', // For local development
    // Add your frontend URL here
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Root route - Add this!
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Blood Donation API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      hospitals: 'GET /api/hospitals',
      events: 'GET /api/events',
      testimonials: 'GET /api/testimonials',
      tips: 'GET /api/tips',
      bloodMarket: 'POST /api/blood-market',
      newsletter: 'POST /api/newsletter',
      benefits: 'GET /api/benefits',
      profile: 'GET /api/profile'
    },
    documentation: 'API documentation available at /api/health',
    status: 'operational'
  });
});

// Mount API routes
app.use('/api', routes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    suggestion: 'Try /api/health for available endpoints'
  });
});

// Error handler MUST be last
app.use(errorHandler);

export default app;