const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const EventStatus = require('./backend/src/models/EventStatus');
const BASE_URL = 'http://localhost:5000';
const ADMIN_KEY = 'dev-admin-key';

let testGameId = null;

async function runTests() {
  console.log('🧪 Event API Integration Tests\n');
  console.log('='.repeat(60));

  let passed = 0;
  let failed = 0;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Setup: Create test game
    console.log('📝 SETUP: Creating test game');
    const testGame = await EventStatus.create({
      eventName: 'Test Event',
      isActive: false,
      isCompleted: false
    });
    testGameId = testGame._id.toString();
    console.log('✅ Test game created:', testGameId, '\n');

    // Test 1: Start game
    console.log('📝 TEST 1: Start game');
    try {
      const response = await axios.post(
        `${BASE_URL}/api/event/start`,
        { gameId: testGameId },
        { headers: { 'x-admin-key': ADMIN_KEY } }
      );
      
      if (response.status === 200 && response.data.game.isActive) {
        console.log('✅ Game started successfully');
        passed++;
      } else {
        console.log('❌ Unexpected response');
        failed++;
      }
    } catch (error) {
      console.log('❌ Failed:', error.response?.data || error.message);
      failed++;
    }

    // Test 2: Start already active game (should fail)
    console.log('\n📝 TEST 2: Start already active game (should fail)');
    try {
      await axios.post(
        `${BASE_URL}/api/event/start`,
        { gameId: testGameId },
        { headers: { 'x-admin-key': ADMIN_KEY } }
      );
      console.log('❌ Should have failed but succeeded');
      failed++;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected: Game already active');
        passed++;
      } else {
        console.log('❌ Wrong error:', error.response?.data);
        failed++;
      }
    }

    // Test 3: Pause game
    console.log('\n📝 TEST 3: Pause game');
    try {
      const response = await axios.post(
        `${BASE_URL}/api/event/pause`,
        { gameId: testGameId },
        { headers: { 'x-admin-key': ADMIN_KEY } }
      );
      
      if (response.status === 200 && !response.data.game.isActive) {
        console.log('✅ Game paused successfully');
        passed++;
      } else {
        console.log('❌ Unexpected response');
        failed++;
      }
    } catch (error) {
      console.log('❌ Failed:', error.response?.data || error.message);
      failed++;
    }

    // Test 4: Pause inactive game (should fail)
    console.log('\n📝 TEST 4: Pause inactive game (should fail)');
    try {
      await axios.post(
        `${BASE_URL}/api/event/pause`,
        { gameId: testGameId },
        { headers: { 'x-admin-key': ADMIN_KEY } }
      );
      console.log('❌ Should have failed but succeeded');
      failed++;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected: Game not active');
        passed++;
      } else {
        console.log('❌ Wrong error:', error.response?.data);
        failed++;
      }
    }

    // Test 5: Reset game
    console.log('\n📝 TEST 5: Reset game');
    try {
      const response = await axios.post(
        `${BASE_URL}/api/event/reset`,
        { gameId: testGameId },
        { headers: { 'x-admin-key': ADMIN_KEY } }
      );
      
      if (response.status === 200 && !response.data.game.isActive && !response.data.game.startTime) {
        console.log('✅ Game reset successfully');
        passed++;
      } else {
        console.log('❌ Unexpected response');
        failed++;
      }
    } catch (error) {
      console.log('❌ Failed:', error.response?.data || error.message);
      failed++;
    }

    // Test 6: Unauthorized access
    console.log('\n📝 TEST 6: Unauthorized access (should fail)');
    try {
      await axios.post(
        `${BASE_URL}/api/event/start`,
        { gameId: testGameId },
        { headers: { 'x-admin-key': 'wrong-key' } }
      );
      console.log('❌ Should have failed but succeeded');
      failed++;
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected: Unauthorized');
        passed++;
      } else {
        console.log('❌ Wrong error:', error.response?.data);
        failed++;
      }
    }

    // Test 7: Missing game ID
    console.log('\n📝 TEST 7: Missing game ID (should fail)');
    try {
      await axios.post(
        `${BASE_URL}/api/event/start`,
        {},
        { headers: { 'x-admin-key': ADMIN_KEY } }
      );
      console.log('❌ Should have failed but succeeded');
      failed++;
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly rejected: Game ID required');
        passed++;
      } else {
        console.log('❌ Wrong error:', error.response?.data);
        failed++;
      }
    }

    // Test 8: Invalid game ID
    console.log('\n📝 TEST 8: Invalid game ID (should fail)');
    try {
      await axios.post(
        `${BASE_URL}/api/event/start`,
        { gameId: 'invalid-id' },
        { headers: { 'x-admin-key': ADMIN_KEY } }
      );
      console.log('❌ Should have failed but succeeded');
      failed++;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 500) {
        console.log('✅ Correctly rejected: Invalid game ID');
        passed++;
      } else {
        console.log('❌ Wrong error:', error.response?.data);
        failed++;
      }
    }

    // Test 9: Get game status
    console.log('\n📝 TEST 9: Get game status');
    try {
      const response = await axios.get(`${BASE_URL}/api/event/status/${testGameId}`);
      
      if (response.status === 200 && response.data._id) {
        console.log('✅ Game status retrieved');
        passed++;
      } else {
        console.log('❌ Unexpected response');
        failed++;
      }
    } catch (error) {
      console.log('❌ Failed:', error.response?.data || error.message);
      failed++;
    }

    // Cleanup
    console.log('\n🧹 CLEANUP: Removing test game');
    await EventStatus.findByIdAndDelete(testGameId);
    console.log('✅ Test game removed');

  } catch (error) {
    console.error('❌ Test suite error:', error.message);
  } finally {
    await mongoose.connection.close();
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  console.log('='.repeat(60));

  if (failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    process.exit(0);
  } else {
    console.log(`\n⚠️ ${failed} TEST(S) FAILED`);
    process.exit(1);
  }
}

// Check server
axios.get(`${BASE_URL}/api/health`)
  .then(() => {
    console.log('✅ Backend server is running\n');
    runTests();
  })
  .catch(() => {
    console.error('❌ Backend server is not running!');
    console.error('Start with: cd backend && npm run dev');
    process.exit(1);
  });
