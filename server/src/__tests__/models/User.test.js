const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');

describe('User Model Superlikes', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should initialize user with default superlike values', async () => {
    const user = new User({
      telegramId: '12345',
      username: 'testuser'
    });

    expect(user.superlikes.daily.count).toBe(0);
    expect(user.superlikes.limit).toBe(3);
    expect(user.superlikes.daily.lastReset).toBeDefined();
  });

  it('should allow superlike when under daily limit', async () => {
    const user = new User({
      telegramId: '12345',
      username: 'testuser'
    });
    await user.save();

    const canSuperlike = await user.canSuperlike();
    expect(canSuperlike).toBe(true);

    const success = await user.useSuperlike();
    expect(success).toBe(true);
    expect(user.superlikes.daily.count).toBe(1);
  });

  it('should prevent superlike when daily limit reached', async () => {
    const user = new User({
      telegramId: '12345',
      username: 'testuser'
    });
    await user.save();

    // Use all 3 superlikes
    await user.useSuperlike();
    await user.useSuperlike();
    await user.useSuperlike();

    const canSuperlike = await user.canSuperlike();
    expect(canSuperlike).toBe(false);

    const success = await user.useSuperlike();
    expect(success).toBe(false);
    expect(user.superlikes.daily.count).toBe(3);
  });

  it('should reset count after 24 hours', async () => {
    const user = new User({
      telegramId: '12345',
      username: 'testuser'
    });
    await user.save();

    // Use all superlikes
    await user.useSuperlike();
    await user.useSuperlike();
    await user.useSuperlike();

    // Set lastReset to 25 hours ago
    user.superlikes.daily.lastReset = new Date(Date.now() - 25 * 60 * 60 * 1000);
    await user.save();

    const canSuperlike = await user.canSuperlike();
    expect(canSuperlike).toBe(true);
    expect(user.superlikes.daily.count).toBe(0);
  });
});