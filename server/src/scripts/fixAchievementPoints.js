// server/src/scripts/fixAchievementPoints.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function fixAchievementPoints() {
  try {
    console.log('Starting achievement points fix...');
    
    const users = await mongoose.connection.collection('users').find({}).toArray();
    
    for (const user of users) {
      // Calculate total achievement points
      const achievementsTotal = Object.values(user.achievements || {})
        .reduce((sum, achievement) => sum + (achievement.points || 0), 0);
        
      // Update user
      await mongoose.connection.collection('users').updateOne(
        { _id: user._id },
        {
          $set: {
            'pointsBreakdown.achievements': achievementsTotal,
            totalPoints: (
              (user.pointsBreakdown.likes || 0) +
              (user.pointsBreakdown.dislikes || 0) +
              ((user.pointsBreakdown.superLikes || 0) * 3) +
              (user.pointsBreakdown.tasks || 0) +
              (user.pointsBreakdown.referrals || 0) +
              achievementsTotal
            )
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
  .then(() => fixAchievementPoints())
  .catch(console.error);