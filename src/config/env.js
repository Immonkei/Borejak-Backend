// src/config/env.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from root directory (one level up from src/)
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

console.log('Environment loaded:', process.env.NODE_ENV);