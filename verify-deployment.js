// Deployment verification script
const https = require('https');

const VERCEL_URL = process.env.VERCEL_URL || 'escape-room-ivory-nine.vercel.app';

function testEndpoint(path) {
  return new Promise((resolve) => {
    https.get(`https://${VERCEL_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, path, contentType: res.headers['content-type'] });
      });
    }).on('error', (err) => {
      resolve({ status: 'ERROR', path, error: err.message });
    });
  });
}

async function verify() {
  console.log(`🔍 Verifying deployment: ${VERCEL_URL}\n`);
  
  const tests = [
    { path: '/', expected: 'text/html', name: 'Frontend Root' },
    { path: '/login', expected: 'text/html', name: 'Login Page' },
    { path: '/dashboard', expected: 'text/html', name: 'Dashboard' },
    { path: '/api/health', expected: 'application/json', name: 'API Health' },
    { path: '/api/settings', expected: 'application/json', name: 'API Settings' },
  ];

  for (const test of tests) {
    const result = await testEndpoint(test.path);
    const status = result.status === 200 ? '✅' : '❌';
    const typeMatch = result.contentType?.includes(test.expected) ? '✅' : '⚠️';
    console.log(`${status} ${test.name}: ${result.status} ${typeMatch} ${result.contentType || result.error}`);
  }
  
  console.log('\n✅ Verification complete!');
}

verify();
