const mongoose = require('mongoose');
const Meme = require('../models/Meme');
const User = require('../models/User');
const PointsTransaction = require('../models/Points');
require('dotenv').config({ path: '../../.env' });

async function testLeaderboard() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // Create test users
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const user = await User.findOneAndUpdate(
        { telegramId: `test${i}` },
        {
          username: `testuser${i}`,
          points: 0,
          totalPoints: 0,
          statistics: {
            likes: 0,
            dislikes: 0,
            superLikes: 0,
            tasksCompleted: 0,
            referrals: 0
          }
        },
        { upsert: true, new: true }
      );
      users.push(user);
    }
    console.log('\nCreated test users:', users.map(u => u.username));

    // Get some memes
    const memes = await Meme.find().limit(3);
    console.log('\nSelected memes:', memes.map(m => m.projectName));

    // Simulate interactions
    console.log('\nSimulating interactions...');
    for (const user of users) {
      const numInteractions = Math.floor(Math.random() * 5) + 1; // 1-5 interactions per user
      
      for (let i = 0; i < numInteractions; i++) {
        const meme = memes[Math.floor(Math.random() * memes.length)];
        const action = Math.random() < 0.3 ? 'superlike' : 'like';
        const points = action === 'superlike' ? 3 : 1;

        // Update meme engagement
        if (action === 'superlike') {
          meme.engagement.superLikes += 1;
        } else {
          meme.engagement.likes += 1;
        }
        await meme.save();

        // Update user points
        user.points += points;
        user.totalPoints += points;
        user.statistics[action === 'superlike' ? 'superLikes' : 'likes'] += 1;
        await user.save();

        // Create points transaction
        await PointsTransaction.create({
          user: user._id,
          amount: points,
          type: 'earn',
          source: action,
          relatedEntity: {
            entityType: 'meme',
            entityId: meme._id
          }
        });

        console.log(`${user.username} ${action}d ${meme.projectName} (+${points} points)`);
      }
    }

    // Display leaderboard
    console.log('\nUser Leaderboard:');
    const userLeaderboard = await User.find()
      .sort('-totalPoints')
      .select('username totalPoints statistics');
    
    userLeaderboard.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username}: ${user.totalPoints} points`);
      console.log(`   Likes: ${user.statistics.likes}, Super Likes: ${user.statistics.superLikes}`);
    });

    // Display meme leaderboard
    console.log('\nMeme Leaderboard:');
    const memeLeaderboard = await Meme.find()
      .sort({ 'engagement.superLikes': -1, 'engagement.likes': -1 })
      .select('projectName engagement');

    memeLeaderboard.forEach((meme, index) => {
      const totalPoints = meme.engagement.likes + (meme.engagement.superLikes * 3);
      console.log(`${index + 1}. ${meme.projectName}: ${totalPoints} points`);
      console.log(`   Likes: ${meme.engagement.likes}, Super Likes: ${meme.engagement.superLikes}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
}

testLeaderboard();