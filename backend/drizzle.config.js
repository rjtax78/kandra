import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './src/.env' });

// Build credentials object conditionally
const credentials = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'kandra_db',
};

// Only add password if it's not empty
if (process.env.DB_PASSWORD) {
  credentials.password = process.env.DB_PASSWORD;
}

export default defineConfig({
  dialect: 'mysql',
  schema: './src/db/schema.js',
  out: './drizzle',
  dbCredentials: credentials,
  verbose: true,
  strict: true,
});
