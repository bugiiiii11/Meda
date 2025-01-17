// server/src/scripts/migrateAchievements.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meda';

// Achievement tiers configuration
const ACHIEVEMENT_TIERS = {
  powerUps: [
    { level: 1, min: 0, max: 49, reward: 100, name: "Energy Collector" },
    { level: 2, min: 50, max: 499, reward: 500, name: "Loot Seeker" },
    { level: 3, min: 500, max: 2999, reward: 2000, name: "Boost Master" },
    { level: 4, min: 3000, max: 10000, reward: 5000, name: "Power Overlord" }
  ],
  criticals: [
    { level: 1, min: 0, max: 9, reward: 100, name: "Critical Slayer" },
    { level: 2, min: 10, max: 19, reward: 300, name: "Chaos Bringer" },
    { level: 3, min: 20, max: 29, reward: 500, name: "Shadow Assassin" },
    { level: 4, min: 30, max: 50, reward: 1000, name: "Phantom Eliminator" }
  ],
  strikes: [
    { level: 1, min: 0, max: 29, reward: 200, name: "Skybound Adventurer" },
    { level: 2, min: 31, max: 299, reward: 1000, name: "Sky Blazer" },
    { level: 3, min: 300, max: 999, reward: 3000, name: "Star Voyager" },
    { level: 4, min: 1000, max: 3000, reward: 10000, name: "Astral Dominator" }
  ],
  referrals: [
    { level: 1, min: 0, max: 3, reward: 200, name: "Link Scout" },
    { level: 2, min: 4, max: 9, reward: 1000, name: "Network Ninja" },
    { level: 3, min: 10, max: 29, reward: 3000, name: "Connection Guru" },
    { level: 4, min: 30, max: 100, reward: 10000, name: "Alliance Commander" }
  ]
};

async function migrateDatabase() {
  try {
    console.log('Starting migration...');
    console.log('Using MongoDB URI:', MONGODB_URI);

    // Update achievement tasks with new tier structure
    console.log('Updating achievement tasks...');
    await mongoose.connection.collection('tasks').updateMany(
      { type: 'achievement' },
      {
        $set: {
          'tiers': {
            'likes': ACHIEVEMENT_TIERS.powerUps,
            'dislikes': ACHIEVEMENT_TIERS.criticals,
            'superLikes': ACHIEVEMENT_TIERS.strikes,
            'referrals': ACHIEVEMENT_TIERS.referrals
          }
        }
      }
    );

    // Get all users with their referral data
    console.log('Preserving referral data...');
    const users = await mongoose.connection.collection('users').find({}).toArray();
    const referralData = users.map(user => ({
      telegramId: user.telegramId,
      username: user.username,
      referralStats: user.referralStats,
      referredBy: user.referredBy
    }));

    // Clean user data while preserving referrals
    console.log('Cleaning user data...');
    await mongoose.connection.collection('users').updateMany(
      {},
      {
        $set: {
          totalPoints: 0,
          pointsBreakdown: {
            likes: 0,
            dislikes: 0,
            superLikes: 0,
            tasks: 0,
            referrals: 0,
            achievements: 0
          },
          completedTasks: []
        }
      }
    );

    // Restore referral data for each user
    console.log('Restoring referral data...');
    for (const userData of referralData) {
      if (userData.telegramId) {
        await mongoose.connection.collection('users').updateOne(
          { telegramId: userData.telegramId },
          {
            $set: {
              referralStats: userData.referralStats || {
                referredUsers: [],
                totalReferralPoints: 0
              },
              referredBy: userData.referredBy
            }
          }
        );
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Connect and run migration
console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => migrateDatabase())
  .then(() => {
    console.log('Migration completed, disconnecting...');
    return mongoose.disconnect();
  })
  .catch(error => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });