const mongoose = require('mongoose');
const Meme = require('../models/Meme');
const User = require('../models/User');
require('dotenv').config({ path: '../../.env' });

async function cleanAndTestLeaderboard() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!\n');

    // First check existing data
    console.log('Checking current database state...');
    const userCount = await User.countDocuments();
    const memeCount = await Meme.countDocuments();
    console.log(`Found ${userCount} users and ${memeCount} memes\n`);

    // Clean up test users with 0 points
    console.log('Cleaning up old test users...');
    const deleteResult = await User.deleteMany({ 
      username: 'testuser',
      points: 0,
      totalPoints: 0
    });
    console.log(`Deleted ${deleteResult.deletedCount} old test users\n`);

    // Get user stats
    console.log('Fetching user stats...');
    const users = await User.find()
      .sort('-totalPoints')
      .select('username totalPoints statistics');
    
    console.log('\nUser Leaderboard:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username || 'Anonymous'}: ${user.totalPoints} points`);
      console.log(`   Likes: ${user.statistics.likes}, Super Likes: ${user.statistics.superLikes}`);
    });

    // Get project stats
    console.log('\nFetching project stats...');
    const projects = await Meme.aggregate([
      {
        $group: {
          _id: '$projectName',
          totalLikes: { $sum: '$engagement.likes' },
          totalSuperLikes: { $sum: '$engagement.superLikes' },
          memeCount: { $sum: 1 }
        }
      },
      {
        $project: {
          projectName: '$_id',
          totalLikes: 1,
          totalSuperLikes: 1,
          memeCount: 1,
          totalPoints: {
            $add: [
              '$totalLikes',
              { $multiply: ['$totalSuperLikes', 3] }
            ]
          }
        }
      },
      {
        $sort: { totalPoints: -1 }
      }
    ]);

    console.log('\nProject Leaderboard:');
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project._id}`);
      console.log(`   Total Points: ${project.totalPoints}`);
      console.log(`   Likes: ${project.totalLikes}, Super Likes: ${project.totalSuperLikes}`);
      console.log(`   Number of Memes: ${project.memeCount}`);
    });

    // Final stats
    console.log('\nFinal Database Stats:');
    console.log(`Total Users: ${await User.countDocuments()}`);
    console.log(`Total Memes: ${await Meme.countDocuments()}`);
    console.log(`Total Projects: ${projects.length}`);

  } catch (error) {
    console.error('\nError occurred:', error);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } finally {
    if (mongoose.connection.readyState === 1) {  // Connected
      await mongoose.connection.close();
      console.log('\nConnection closed');
    }
  }
}

// Execute and handle any unhandled promise rejections
cleanAndTestLeaderboard().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});