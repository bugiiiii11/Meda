//dev-setup.js
const ngrok = require('ngrok');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDevEnvironment() {
  try {
    // Start ngrok tunnel
    const url = await ngrok.connect({
      addr: 3000,
      proto: 'http'
    });

    console.log('\nDevelopment Setup URLs:');
    console.log('Local React App:', 'http://localhost:3000');
    console.log('Ngrok URL:', url);
    console.log('Local API Server:', 'http://localhost:3001');

    // Update .env file with new URL
    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update or add WEBAPP_URL
    if (envContent.includes('WEBAPP_URL=')) {
      envContent = envContent.replace(/WEBAPP_URL=.*/, `WEBAPP_URL=${url}`);
    } else {
      envContent += `\nWEBAPP_URL=${url}`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('\nEnvironment file updated with new Ngrok URL');

  } catch (error) {
    console.error('Error setting up development environment:', error);
    console.error('Detailed error:', error.stack);
    process.exit(1);
  }
}

setupDevEnvironment();