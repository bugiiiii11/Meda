const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');

// Mock the auth middleware for testing
jest.mock('../../middleware/auth', () => ({
  bypassAuthInDevelopment: (req, res, next) => {
    req.telegramUser = {
      id: req.body.telegramId || req.params.telegramId,
      username: 'testUser'
    };
    next();
  }
}));

describe('Superlike API Integration', () => {
  let mongoServer;
  let testUser;

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
    // Create test user
    testUser = await User.create({
      telegramId: '1518676858',
      username: 'testUser'
    });
  });

  describe('GET /api/superlikes/status/:telegramId', () => {
    it('should return initial superlike status', async () => {
      const res = await request(app)
        .get(`/api/superlikes/status/${testUser.telegramId}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.remainingSuperlikes).toBe(3);
      expect(res.body.data.canSuperlike).toBe(true);
    });
  });

  describe('POST /api/superlikes/use', () => {
    it('should successfully use a superlike', async () => {
      const res = await request(app)
        .post('/api/superlikes/use')
        .send({
          telegramId: testUser.telegramId,
          memeId: 1
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.remainingSuperlikes).toBe(2);
    });

    it('should prevent superlike when limit reached', async () => {
      // Use all 3 superlikes
      for(let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/superlikes/use')
          .send({
            telegramId: testUser.telegramId,
            memeId: i + 1
          });
      }

      // Try fourth superlike
      const res = await request(app)
        .post('/api/superlikes/use')
        .send({
          telegramId: testUser.telegramId,
          memeId: 4
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('No superlikes remaining');
    });

    it('should reset count after 24 hours', async () => {
      // Use all superlikes
      for(let i = 0; i < 3; i++) {
        await request(app)
          .post('/api/superlikes/use')
          .send({
            telegramId: testUser.telegramId,
            memeId: i + 1
          });
      }

      // Set lastReset to 25 hours ago
      testUser.superlikes.daily.lastReset = new Date(Date.now() - 25 * 60 * 60 * 1000);
      await testUser.save();

      // Try another superlike
      const res = await request(app)
        .post('/api/superlikes/use')
        .send({
          telegramId: testUser.telegramId,
          memeId: 4
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.remainingSuperlikes).toBe(2);
    });
  });
});