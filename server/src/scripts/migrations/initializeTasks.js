// server/src/scripts/migrations/initializeTasks.js
const mongoose = require('mongoose');
require('dotenv').config();

const Task = require('../../models/Task');

async function initializeTasks() {
  try {
    console.log('Starting tasks initialization...');

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Define quick tasks
    const quickTasks = [
      {
        taskId: 'website',
        type: 'quick',
        category: 'link',
        label: 'Browse Our Web',
        link: 'https://cryptomeme.me',
        points: 10,
        isRepeatable: false
      },
      {
        taskId: 'telegram',
        type: 'quick',
        category: 'link',
        label: 'Join Telegram Chat',
        link: 'https://t.me/pumpme_me',
        points: 10,
        isRepeatable: false
      },
      {
        taskId: 'twitter',
        type: 'quick',
        category: 'link',
        label: 'Follow X',
        link: 'https://x.com/pumpme_me',
        points: 10,
        isRepeatable: false
      },
      {
        taskId: 'instagram',
        type: 'quick',
        category: 'link',
        label: 'Follow Instagram',
        link: 'https://instagram.com/pumpme_me',
        points: 10,
        isRepeatable: false
      }
    ];

    // Define achievement tasks (without points field)
    const achievementTasks = [
      {
        taskId: 'achievement-likes',
        type: 'achievement',
        category: 'likes',
        label: 'Give Likes',
        isRepeatable: false,
        tiers: [
          { level: 1, target: 1000, points: 1000 },
          { level: 2, target: 5000, points: 5000 },
          { level: 3, target: 25000, points: 25000 },
          { level: 4, target: 125000, points: 125000 }
        ]
      },
      {
        taskId: 'achievement-dislikes',
        type: 'achievement',
        category: 'dislikes',
        label: 'Give Dislikes',
        isRepeatable: false,
        tiers: [
          { level: 1, target: 1000, points: 1000 },
          { level: 2, target: 5000, points: 5000 },
          { level: 3, target: 25000, points: 25000 },
          { level: 4, target: 125000, points: 125000 }
        ]
      },
      {
        taskId: 'achievement-superlikes',
        type: 'achievement',
        category: 'superLikes',
        label: 'Give Super Likes',
        isRepeatable: false,
        tiers: [
          { level: 1, target: 100, points: 1000 },
          { level: 2, target: 500, points: 5000 },
          { level: 3, target: 2500, points: 25000 },
          { level: 4, target: 12500, points: 125000 }
        ]
      },
      {
        taskId: 'achievement-referrals',
        type: 'achievement',
        category: 'referrals',
        label: 'Invite Friends',
        isRepeatable: false,
        tiers: [
          { level: 1, target: 20, points: 1000 },
          { level: 2, target: 100, points: 5000 },
          { level: 3, target: 500, points: 25000 },
          { level: 4, target: 2500, points: 125000 }
        ]
      }
    ];

    // News task
    const newsTask = {
      taskId: 'news-1',
      type: 'news',
      category: 'link',
      label: 'Read the Latest News',
      link: 'https://x.com/bitcoinlfgo/status/1868172844129235110',
      points: 10,
      isRepeatable: true,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

    // Insert all tasks using the model to ensure proper schema validation
    for (const task of [...quickTasks, ...achievementTasks, [newsTask]].flat()) {
      const taskDoc = new Task(task);
      await taskDoc.save();
    }
    
    console.log('Tasks initialized successfully');

    // Verify the data
    const taskCount = await Task.countDocuments();
    console.log(`Total tasks created: ${taskCount}`);

    // Print example of each type
    const quickExample = await Task.findOne({ type: 'quick' });
    const achievementExample = await Task.findOne({ type: 'achievement' });
    const newsExample = await Task.findOne({ type: 'news' });

    console.log('\nExample Quick Task:', JSON.stringify(quickExample, null, 2));
    console.log('\nExample Achievement Task:', JSON.stringify(achievementExample, null, 2));
    console.log('\nExample News Task:', JSON.stringify(newsExample, null, 2));

  } catch (error) {
    console.error('Error initializing tasks:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  initializeTasks()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = initializeTasks;