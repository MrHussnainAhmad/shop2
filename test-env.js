require('dotenv').config({ path: '.env.local' });

console.log('Environment Variables Check:');
console.log('============================');

const requiredVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'MONGODB_URI',
  'WEBHOOK_SECRET'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? '✓ SET' : '✗ MISSING'}`);
  if (value) {
    console.log(`  Length: ${value.length} characters`);
    console.log(`  Starts with: ${value.substring(0, 10)}...`);
  }
  console.log('');
});

// Test basic connectivity
console.log('Node.js version:', process.version);
console.log('Current working directory:', process.cwd());
console.log('Environment:', process.env.NODE_ENV || 'development');
