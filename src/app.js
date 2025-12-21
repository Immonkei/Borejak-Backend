import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import errorHandler from './middlewares/error.js';

const app = express();

app.use(cors());
app.use(express.json());

// mount all routes
app.use('/api', routes);

// error handler MUST be last
app.use(errorHandler);

export default app;
