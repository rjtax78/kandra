#!/usr/bin/env node

/**
 * KANDRA Database Setup Script
 * Automatically sets up the database using the kandra_db.sql file
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: './src/.env' });

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔄 Connecting to MySQL server...');
    
    // Connect without specifying database first
    connection = await mysql.createConnection(config);
    
    console.log('✅ Connected to MySQL server');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'src', 'migrations', 'kandra_db.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found at: ${sqlFilePath}`);
    }
    
    console.log('📖 Reading database schema file...');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('🏗️  Creating database and tables...');
    
    // Execute the SQL file
    await connection.execute(sqlContent);
    
    console.log('✅ Database setup completed successfully!');
    
    // Verify the database exists
    await connection.execute(`USE ${process.env.DB_NAME || 'kandra_db'}`);
    
    // Check if tables were created
    const [rows] = await connection.execute('SHOW TABLES');
    console.log(`📊 Created ${rows.length} tables:`);
    rows.forEach(row => {
      console.log(`   - ${Object.values(row)[0]}`);
    });
    
    // Check if sample data exists
    const [competences] = await connection.execute('SELECT COUNT(*) as count FROM competences');
    console.log(`🎯 Found ${competences[0].count} sample competences in database`);
    
    console.log('\n🎉 Database setup completed! You can now start the application.');
    console.log('📝 Next steps:');
    console.log('   1. cd backend && npm run dev');
    console.log('   2. cd frontend && npm run dev');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔑 Please check your MySQL credentials in backend/src/.env');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('🔌 Please ensure MySQL server is running');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Add some helpful CLI options
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🚀 KANDRA Database Setup Script

Usage: node setup-database.js [options]

Options:
  --help, -h     Show this help message
  --check        Check database connection only
  --reset        Reset database (DROP and recreate)

Environment variables (set in backend/src/.env):
  DB_HOST        MySQL host (default: localhost)
  DB_USER        MySQL username (default: root)  
  DB_PASSWORD    MySQL password (default: empty)
  DB_NAME        Database name (default: kandra_db)

Examples:
  node setup-database.js           # Setup database
  node setup-database.js --check   # Test connection
  `);
  process.exit(0);
}

if (args.includes('--check')) {
  console.log('🔍 Testing database connection...');
  mysql.createConnection(config)
    .then(conn => {
      console.log('✅ Database connection successful!');
      return conn.end();
    })
    .catch(err => {
      console.error('❌ Database connection failed:', err.message);
      process.exit(1);
    });
} else {
  setupDatabase();
}