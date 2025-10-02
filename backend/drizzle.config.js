import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './src/.env' });

export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema.js',
  out: './drizzle',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kandra_db',
  },
  verbose: true,
  strict: true,
});