// src/config/index.ts
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  port: number;
  jwtSecret: string;
  jwtExpiry: string;
  databaseUrl: string; // Add if you want to use it here, though Prisma reads it directly
  nodeEnv: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10), // Default to 3000
  jwtSecret: process.env.JWT_SECRET_KEY || 'supersecretdefaultforlocaldev', // **Change this in production!**
  jwtExpiry: process.env.JWT_EXPIRY || '1h',
  databaseUrl: process.env.DATABASE_URL || '', // It's good practice to have it here too
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Basic validation for critical config
if (!config.jwtSecret || config.jwtSecret === 'supersecretdefaultforlocaldev') {
  console.warn('WARNING: JWT_SECRET is not set or using default value. Set a strong secret in your .env file!');
}
if (!config.databaseUrl) {
  console.warn('WARNING: DATABASE_URL is not set in your .env file!');
}

export default config;