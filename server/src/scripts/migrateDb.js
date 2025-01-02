const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const Meme = require('../src/models/Meme');
const Project = require('../src/models/Project');
const PointsTransaction = require('../src/models/Points');
const ViewHistory = require('../src/models/ViewHistory');
const Task = require('../src/models/Task');
const TaskCompletion = require('../src/models/TaskCompletion');
const Analytics = require('../src/models/Analytics');

async function migrateData() {
  try {
    // Connect to source database (meda-dbz)
    const sourceUri = process.env.MONGODB_URI.replace('/meda-db', '/meda-dbz');
    const sourceDb = await mongoose.createConnection(sourceUri);
    
    // Connect to target database (meda-db)
    const targetDb = await mongoose.connect(process.env.MONGODB_URI);

    // Migrate Users
    const users = await sourceDb.model('User', User.schema).find({});
    if (users.length > 0) {
      await User.deleteMany({}); // Clear existing users in target
      await User.insertMany(users);
      console.log(`Migrated ${users.length} users`);
    }

    // Verify all collections exist in target database
    const collections = [
      { model: User, name: 'users' },
      { model: Meme, name: 'memes' },
      { model: Project, name: 'projects' },
      { model: PointsTransaction, name: 'pointstransactions' },
      { model: ViewHistory, name: 'viewhistories' },
      { model: Task, name: 'tasks' },
      { model: TaskCompletion, name: 'taskcompletions' },
      { model: Analytics, name: 'analytics' }
    ];

    // Create indexes for all collections
    for (const collection of collections) {
      await collection.model.createIndexes();
      console.log(`Created indexes for ${collection.name}`);
    }

    console.log('Migration completed successfully');

    // Close connections
    await sourceDb.close();
    await targetDb.close();

  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

migrateData();