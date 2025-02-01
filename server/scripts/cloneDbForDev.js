const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import all models
const User = require('../src/models/User');
const Meme = require('../src/models/Meme');
const Project = require('../src/models/Project');
const PointsTransaction = require('../src/models/Points');
const ViewHistory = require('../src/models/ViewHistory');
const Task = require('../src/models/Task');
const TaskCompletion = require('../src/models/TaskCompletion');
const Analytics = require('../src/models/Analytics');
const WhitelistedUser = require('../src/models/WhitelistedUser');

async function migrateDatabase() {
  let sourceDb = null;
  let targetDb = null;

  try {
    console.log('Starting database migration...');

    // Connect to source database (meda-db)
    const sourceUri = process.env.MONGODB_URI;
    sourceDb = await mongoose.createConnection(sourceUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to source database (meda-db)');

    // Connect to target database (DEV-meda-db)
    const targetUri = process.env.MONGODB_URI.replace('/meda-db', '/DEV-meda-db');
    targetDb = await mongoose.createConnection(targetUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to target database (DEV-meda-db)');

    // Define collections to migrate with their corresponding models
    const collections = [
      { model: User, name: 'users' },
      { model: Meme, name: 'memes' },
      { model: Project, name: 'projects' },
      { model: PointsTransaction, name: 'pointstransactions' },
      { model: ViewHistory, name: 'viewhistories' },
      { model: Task, name: 'tasks' },
      { model: TaskCompletion, name: 'taskcompletions' },
      { model: Analytics, name: 'analytics' },
      { model: WhitelistedUser, name: 'whitelistedusers' }
    ];

    // Migrate each collection
    for (const collection of collections) {
      try {
        console.log(`Migrating ${collection.name}...`);
        
        // Create models for both source and target databases
        const sourceModel = sourceDb.model(collection.model.modelName, collection.model.schema);
        const targetModel = targetDb.model(collection.model.modelName, collection.model.schema);
        
        // Get data from source database
        const documents = await sourceModel.find({}).lean();
        
        if (documents.length > 0) {
          // Clear existing data in target (DEV) database only
          console.log(`Clearing existing ${collection.name} from DEV database...`);
          await targetModel.deleteMany({});
          console.log(`✓ Cleared existing ${collection.name} from DEV database`);
          
          // Insert documents into target database in batches
          const batchSize = 100;
          for (let i = 0; i < documents.length; i += batchSize) {
            const batch = documents.slice(i, i + batchSize);
            await targetModel.insertMany(batch, { ordered: false });
            console.log(`Inserted batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(documents.length/batchSize)} for ${collection.name}`);
          }
          
          console.log(`✓ Successfully migrated ${documents.length} documents for ${collection.name}`);
        } else {
          console.log(`ℹ No documents found in ${collection.name}`);
        }
      } catch (error) {
        console.error(`Error migrating ${collection.name}:`, error);
        throw error;
      }
    }

    console.log('\nMigration completed successfully!');
    console.log('Summary:');
    for (const collection of collections) {
      const targetModel = targetDb.model(collection.model.modelName, collection.model.schema);
      const count = await targetModel.countDocuments();
      console.log(`${collection.name}: ${count} documents`);
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close connections
    if (sourceDb) await sourceDb.close();
    if (targetDb) await targetDb.close();
    await mongoose.disconnect();
    console.log('\nConnections closed. Migration finished.');
  }
}

// Run migration
migrateDatabase();