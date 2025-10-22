// Test script để kiểm tra API endpoints
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing API Endpoints...');
  console.log('='.repeat(50));

  try {
    // Test 1: GET /users
    console.log('1️⃣ Testing GET /users...');
    const getResponse = await fetch(`${API_BASE}/users`);
    const users = await getResponse.json();
    console.log('✅ GET /users successful');
    console.log(`📊 Found ${users.length} users`);
    if (users.length > 0) {
      console.log('👤 Sample user:', users[0]);
    }

    // Test 2: POST /users
    console.log('\n2️⃣ Testing POST /users...');
    const newUser = {
      name: 'Test User API',
      email: 'testapi@example.com'
    };
    
    const postResponse = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    });
    
    if (postResponse.ok) {
      const createdUser = await postResponse.json();
      console.log('✅ POST /users successful');
      console.log('👤 Created user:', createdUser);
    } else {
      const error = await postResponse.json();
      console.log('❌ POST /users failed:', error);
    }

    // Test 3: GET /users again to verify
    console.log('\n3️⃣ Testing GET /users after POST...');
    const getResponse2 = await fetch(`${API_BASE}/users`);
    const users2 = await getResponse2.json();
    console.log('✅ GET /users successful');
    console.log(`📊 Now found ${users2.length} users`);

    console.log('\n🎉 All API tests completed!');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('💡 Make sure the server is running on port 3001');
  }
}

// Wait a bit for server to start, then test
setTimeout(testAPI, 3000);

