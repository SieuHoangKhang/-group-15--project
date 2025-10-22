import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import { readFileSync } from 'fs';

// Set MongoDB URI directly for testing
const mongoUri = 'mongodb+srv://minhtien995252_db_user:minhtien995252@cluster0.cso3ogg.mongodb.net/groupDB?retryWrites=true&w=majority&appName=Cluster0';
console.log('🔍 Debug - MONGODB_URI: Found (hardcoded for testing)');

async function testMongoDBConnection() {
  console.log('🧪 Testing MongoDB Atlas connection...');
  console.log('='.repeat(50));

  try {
    // Test connection
    console.log('1️⃣ Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ Connected successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);

    // Test creating a user
    console.log('\n2️⃣ Testing user creation...');
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com'
    });
    console.log('✅ User created successfully!');
    console.log(`👤 User ID: ${testUser._id}`);
    console.log(`📧 Email: ${testUser.email}`);

    // Test finding users
    console.log('\n3️⃣ Testing user retrieval...');
    const users = await User.find();
    console.log(`✅ Found ${users.length} users in database`);

    // Test duplicate email handling
    console.log('\n4️⃣ Testing duplicate email handling...');
    try {
      await User.create({
        name: 'Another User',
        email: 'test@example.com' // Same email
      });
    } catch (error) {
      if (error.code === 11000) {
        console.log('✅ Duplicate email correctly rejected');
      } else {
        throw error;
      }
    }

    // Clean up test data
    console.log('\n5️⃣ Cleaning up test data...');
    await User.deleteOne({ email: 'test@example.com' });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! MongoDB Atlas integration is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('💡 Make sure you have:');
    console.error('   1. Created a .env file with MONGODB_URI');
    console.error('   2. Set up MongoDB Atlas cluster');
    console.error('   3. Created database "groupDB" and collection "users"');
    console.error('   4. Added your IP to MongoDB Atlas Network Access');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test
testMongoDBConnection();

