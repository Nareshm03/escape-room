const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const EventStatus = require('./backend/src/models/EventStatus');
const BASE_URL = 'http://localhost:5000';

async function testGameAPI() {
  console.log('🧪 Testing Game API\n');
  console.log('='.repeat(60));

  let testsPassed = 0;
  let testsFailed = 0;

  // Connect to database
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }

  // Test 1: No active game
  console.log('📝 TEST 1: No active game scenario');
  try {
    await EventStatus.updateMany({}, { isActive: false });
    const response = await axios.get(`${BASE_URL}/api/game`);
    
    if (response.status === 200 && response.data.message === 'no_active_game') {
      console.log('✅ Correctly returns no_active_game message');
      testsPassed++;
    } else {
      console.log('❌ Unexpected response:', response.data);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    testsFailed++;
  }

  // Test 2: Active game exists
  console.log('\n📝 TEST 2: Active game exists');
  try {
    const game = await EventStatus.findOneAndUpdate(
      {},
      { 
        isActive: true,
        eventName: 'Test Game',
        eventDescription: 'Test Description'
      },
      { upsert: true, new: true }
    );
    
    const response = await axios.get(`${BASE_URL}/api/game`);
    
    if (response.status === 200 && response.data._id) {
      console.log('✅ Returns active game data');
      console.log('   Game ID:', response.data._id);
      console.log('   Event Name:', response.data.eventName);
      testsPassed++;
    } else {
      console.log('❌ Unexpected response:', response.data);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    testsFailed++;
  }

  // Test 3: Server error handling
  console.log('\n📝 TEST 3: Error handling (simulated)');
  try {
    await mongoose.connection.close();
    const response = await axios.get(`${BASE_URL}/api/game`);
    console.log('⚠️ Should have failed but got:', response.status);
    testsFailed++;
  } catch (error) {
    if (error.response?.status === 500) {
      console.log('✅ Correctly returns 500 error on database failure');
      testsPassed++;
    } else {
      console.log('❌ Unexpected error:', error.message);
      testsFailed++;
    }
  }

  // Reconnect for cleanup
  await mongoose.connect(process.env.MONGODB_URI);

  // Test 4: Game stages endpoint
  console.log('\n📝 TEST 4: Game stages endpoint');
  try {
    const response = await axios.get(`${BASE_URL}/api/game/stages`);
    
    if (response.status === 200 && Array.isArray(response.data)) {
      console.log('✅ Returns stages array');
      console.log('   Stages count:', response.data.length);
      testsPassed++;
    } else {
      console.log('❌ Unexpected response:', response.data);
      testsFailed++;
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    testsFailed++;
  }

  // Cleanup
  await mongoose.connection.close();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);
  console.log('='.repeat(60));

  if (testsFailed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    process.exit(0);
  } else {
    console.log(`\n⚠️ ${testsFailed} TEST(S) FAILED`);
    process.exit(1);
  }
}

// Check if server is running
axios.get(`${BASE_URL}/api/health`)
  .then(() => {
    console.log('✅ Backend server is running\n');
    testGameAPI();
  })
  .catch(() => {
    console.error('❌ Backend server is not running!');
    console.error('Please start: cd backend && npm run dev');
    process.exit(1);
  });
