const mongoose = require('mongoose');
const Task = require('../src/models/Task');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const initialTasks = [
  {
    taskId: 'telegram',
    type: 'quick',
    category: 'link',
    label: 'Join Telegram Chat',
    points: 10,
    status: 'active',
    link: 'https://t.me/cryptomeda',
    isRepeatable: false
  },
  {
    taskId: 'twitter',
    type: 'quick',
    category: 'link',
    label: 'Follow X',
    points: 10,
    status: 'active',
    link: 'https://x.com/cryptomedatech',
    isRepeatable: false
  },
  {
    taskId: 'news-1',
    type: 'quick',
    category: 'link',
    label: 'Read the Latest News',
    points: 10,
    status: 'active',
    link: 'https://x.com/cryptomedatech/status/1867623339931680995',
    isRepeatable: false
  },
  {
    taskId: 'achievement-likes',
    type: 'achievement',
    category: 'likes',
    label: 'Like Collector (Tier 1)',
    tiers: [{ level: 1, target: 1000, points: 1000 }],
    status: 'active'
  },
  {
    taskId: 'achievement-dislikes',
    type: 'achievement',
    category: 'dislikes',
    label: 'Hater Slayer (Tier 1)',
    tiers: [{ level: 1, target: 1000, points: 1000 }],
    status: 'active'
  },
  {
    taskId: 'achievement-superlikes',
    type: 'achievement',
    category: 'superLikes',
    label: 'Super Swiper (Tier 1)',
    tiers: [{ level: 1, target: 100, points: 1000 }],
    status: 'active'
  },
  {
    taskId: 'achievement-referrals',
    type: 'achievement',
    category: 'referrals',
    label: 'Network Ninja (Tier 1)',
    tiers: [{ level: 1, target: 20, points: 1000 }],
    status: 'active'
  }
];

async function seedTasks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Insert new tasks
    await Task.insertMany(initialTasks);
    console.log('Inserted initial tasks');

    const count = await Task.countDocuments();
    console.log(`Total tasks in database: ${count}`);

  } catch (error) {
    console.error('Error seeding tasks:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedTasks();