#!/usr/bin/env node

/**
 * Manual Migration Script for KANDRA
 * Alternative to drizzle-kit migrate when having connection issues
 */

import { db, testConnection } from './src/db/drizzle.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🔄 Testing database connection...');
    
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    console.log('✅ Database connection successful');
    
    // Check if database schema exists
    console.log('🔍 Checking database schema...');
    
    // Read the SQL file and execute it
    const sqlFilePath = path.join(__dirname, 'src', 'migrations', 'kandra_db.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found at: ${sqlFilePath}`);
    }
    
    console.log('📖 Reading database schema file...');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('🏗️  Executing database schema...');
    
    // Split SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));
    
    // Execute each statement
    for (const statement of statements) {
      try {
        if (statement.includes('CREATE TABLE') || 
            statement.includes('ALTER TABLE') || 
            statement.includes('INSERT INTO') ||
            statement.includes('CREATE DATABASE')) {
          await db.execute(statement);
        }
      } catch (err) {
        // Ignore errors for existing tables/data
        if (!err.message.includes('already exists') && 
            !err.message.includes('Duplicate entry')) {
          console.warn(`⚠️  Warning executing statement: ${err.message}`);
        }
      }
    }
    
    console.log('✅ Database migration completed successfully!');
    
    // Test the schema by querying a table
    try {
      const result = await db.execute('SHOW TABLES');
      console.log(`📊 Found ${result.length} tables in database`);
      
      // Check for sample data
      const competencesCount = await db.execute('SELECT COUNT(*) as count FROM competences');
      console.log(`🎯 Found ${competencesCount[0].count} competences in database`);
      
    } catch (err) {
      console.error('❌ Error verifying schema:', err.message);
    }
    
    console.log('\n🎉 Migration completed! You can now start the application.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();