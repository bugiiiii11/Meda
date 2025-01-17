// server/src/scripts/fixAchievementStructure.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function fixAchievementStructure() {
  try {
    console.log('Starting achievement structure fix...');
    
    // First, ensure all users have the correct base structure
    await mongoose.connection.collection('users').updateMany(
      {},
      {
        $set: {
          'achievements': {
            likes: { points: 0, currentTier: 0 },
            dislikes: { points: 0, currentTier: 0 },
            superLikes: { points: 0, currentTier: 0 },
            referrals: { points: 0, currentTier: 0 }
          }
        }
      }
    );

    // Now process completed tasks to update achievements
    const users = await mongoose.connection.collection('users').find({}).toArray();
    
    for (const user of users) {
      const achievements = {
        likes: { points: 0, currentTier: 0 },
        dislikes: { points: 0, currentTier: 0 },
        superLikes: { points: 0, currentTier: 0 },
        referrals: { points: 0, currentTier: 0 }
      };
      
      // Process completed achievement tasks
      if (user.completedTasks) {
        for (const task of user.completedTasks) {
          if (task.type === 'achievement') {
            const category = task.taskId.split('-')[1]; // e.g., 'likes', 'dislikes'
            if (category && achievements[category]) {
              achievements[category].points += task.pointsAwarded;
              achievements[category].currentTier = Math.max(
                achievements[category].currentTier,
                task.achievementTier
              );
            }
          }
        }
      }

      // Calculate total achievement points
      const totalAchievementPoints = Object.values(achievements)
        .reduce((sum, achievement) => sum + achievement.points, 0);

      // Update user
      await mongoose.connection.collection('users').updateOne(
        { _id: user._id },
        {
          $set: {
            achievements,
            'pointsBreakdown.achievements': totalAchievementPoints
          }
        }
      );
    }
    
    console.log('Fix completed successfully!');
  } catch (error) {
    console.error('Fix failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => fixAchievementStructure())
  .catch(console.error);