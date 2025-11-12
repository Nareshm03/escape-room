// Test script for Vercel deployment
const axios = require('axios');

const BASE_URL = process.env.VERCEL_URL || 'http://localhost:3000';

async function testDeployment() {
  console.log('🧪 Testing Vercel Deployment...\n');
  
  const tests = [
    { name: 'Health Check', url: '/api/health' },
    { name: 'Frontend Root', url: '/' },
    { name: 'Auth Routes', url: '/api/auth/me' },
    { name: 'Quiz Routes', url: '/api/quiz' },
    { name: 'Teams Routes', url: '/api/teams' },
    { name: 'Settings Routes', url: '/api/settings' },
  ];

  for (const test of tests) {
    try {
      const response = await axios.get(`${BASE_URL}${test.url}`, {
        validateStatus: () => true
      });
      const status = response.status < 500 ? '✅' : '❌';
      console.log(`${status} ${test.name}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
    }
  }
  
  console.log('\n✅ Deployment test complete!');
}

testDeployment();
