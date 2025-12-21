import './config/env.js';  
import app from './app.js';

const PORT = process.env.PORT || 5000;

// Export the app for Vercel (ES6 way)
export default app;

// Only run server locally (not on Vercel)
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}