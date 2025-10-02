import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import * as schema from './schema.js';

dotenv.config();

// Create MySQL connection pool
const poolConnection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'kandra_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create Drizzle instance
export const db = drizzle(poolConnection, { 
  schema, 
  mode: 'default',
  logger: process.env.NODE_ENV === 'development'
});

// Export the connection pool for raw queries if needed
export { poolConnection };

// Test connection function
export async function testConnection() {
  try {
    const connection = await poolConnection.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}