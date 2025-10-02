#!/usr/bin/env node

/**
 * KANDRA Development Setup Script
 * Runs all setup commands in sequence for easy development environment setup
 */

import { spawn } from 'child_process';

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Running: ${command} ${args.join(' ')}`);
    
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${command} completed successfully\n`);
        resolve(code);
      } else {
        console.log(`❌ ${command} failed with code ${code}\n`);
        reject(new Error(`Command failed: ${command}`));
      }
    });
  });
}

async function setupDevelopment() {
  console.log('🚀 Setting up KANDRA development environment...\n');

  try {
    // Step 1: Check database connection
    console.log('📡 Step 1: Checking database connection...');
    await runCommand('npm', ['run', 'db:check']);

    // Step 2: Run migrations
    console.log('🗄️  Step 2: Running database migrations...');
    await runCommand('npm', ['run', 'db:migrate']);

    // Step 3: Seed database
    console.log('🌱 Step 3: Seeding database with test data...');
    await runCommand('npm', ['run', 'db:seed']);

    console.log('🎉 Development environment setup completed successfully!');
    console.log('\n📚 What was done:');
    console.log('   ✅ Database connection verified');
    console.log('   ✅ Database schema migrated');
    console.log('   ✅ Test data seeded');
    console.log('\n🚀 Ready to start development!');
    console.log('\nNext steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Test API: npm run test:api');
    console.log('\n📝 Test credentials available in README.md');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n🔧 Manual setup options:');
    console.log('   npm run db:check    # Check database connection');
    console.log('   npm run db:migrate  # Run migrations');
    console.log('   npm run db:seed     # Seed test data');
    process.exit(1);
  }
}

setupDevelopment();