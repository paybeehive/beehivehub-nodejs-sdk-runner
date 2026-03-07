#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '..', '.env');

if (!existsSync(envPath)) {
  console.error('\n❌ Error: .env file not found!');
  console.error('\n💡 Create .env file:');
  console.error('   1. Copy .env.example to .env');
  console.error('   2. Add your BEEHIVE_SECRET_KEY\n');
  process.exit(1);
}

const envContent = readFileSync(envPath, 'utf-8');

if (!envContent.includes('BEEHIVE_SECRET_KEY=') || envContent.includes('your_secret_key_here')) {
  console.error('\n❌ Error: BEEHIVE_SECRET_KEY not configured in .env');
  console.error('\n💡 Edit .env file and replace:');
  console.error('   BEEHIVE_SECRET_KEY=your_secret_key_here');
  console.error('   with your actual API key\n');
  process.exit(1);
}

console.log('✅ Configuration validated!\n');
