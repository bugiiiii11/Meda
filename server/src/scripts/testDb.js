const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/database');

const testDatabase = async () => {
  try {
    await connectDB();
    console.log('Starting database tests...');

    // Get model references
    const User = mongoose.model('User');
    const Meme = mongoose.model('Meme');
    const Project = mongoose.model('Project');
    const Points = mongoose.model('PointsTransaction');

    // First clean up any existing test data
    console.log('Cleaning up existing test data...');
    await Promise.all([
      User.deleteOne({ telegramId: 'test123' }),
      Project.deleteOne({ name: 'Test Project' }),
      Meme.deleteOne({ id: 9999 }),
      Points.deleteOne({ description: 'Test points transaction' })
    ]);

    console.log('Creating test documents...');

    // Test user creation
    const testUser = new User({
      telegramId: 'test123',
      username: 'testuser',
      totalPoints: 0,
      pointsBreakdown: {
        likes: 0,
        dislikes: 0,
        superLikes: 0,
        tasks: 0,
        referrals: 0
      }
    });

    // Test project creation
    const testProject = new Project({
      name: 'Test Project',
      type: 'Meme',
      status: 'active',
      totalScore: 0,
      engagement: {
        likes: 0,
        superLikes: 0
      }
    });

    // Test meme creation
    const testMeme = new Meme({
      id: 9999,
      projectName: 'Test Project',
      content: 'test-content-url',
      status: 'active',
      engagement: {
        likes: 0,
        superLikes: 0,
        dislikes: 0
      }
    });

    // Test points transaction
    const testPoints = new Points({
      user: 'test123',
      amount: 10,
      type: 'earn',
      source: 'like',
      relatedEntity: {
        entityType: 'meme',
        entityId: 9999
      },
      description: 'Test points transaction'
    });

    // Save test documents
    const savedDocs = await Promise.all([
      testUser.save(),
      testProject.save(),
      testMeme.save(),
      testPoints.save()
    ]);

    console.log('Test documents created successfully');
    console.log('Saved documents:', savedDocs.map(doc => ({
      model: doc.constructor.modelName,
      id: doc._id
    })));

    // Clean up test data
    console.log('Cleaning up test data...');
    await Promise.all([
      User.deleteOne({ telegramId: 'test123' }),
      Project.deleteOne({ name: 'Test Project' }),
      Meme.deleteOne({ id: 9999 }),
      Points.deleteOne({ description: 'Test points transaction' })
    ]);

    console.log('Test documents cleaned up successfully');
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    console.log('All tests completed successfully! ✅');

  } catch (error) {
    console.error('Database test failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

testDatabase();