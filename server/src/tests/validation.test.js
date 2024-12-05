const { schemas } = require('../middleware/validation');

describe('Validation Tests', () => {
  describe('Interaction Validation', () => {
    const schema = schemas.handleInteraction;

    test('Valid interactions with different actions', () => {
      ['like', 'dislike', 'superlike'].forEach(action => {
        const validData = {
          action,
          memeId: 123,
          telegramId: 'user123'
        };
        const { error } = schema.validate(validData);
        expect(error).toBeUndefined();
      });
    });

    test('Invalid action types', () => {
      const invalidActions = ['love', '', null, undefined, 123];
      invalidActions.forEach(action => {
        const invalidData = {
          action,
          memeId: 123,
          telegramId: 'user123'
        };
        const { error } = schema.validate(invalidData);
        expect(error).toBeDefined();
      });
    });

    test('Invalid memeId types', () => {
      const invalidMemeIds = ['123', '', null, undefined, false, {}];
      invalidMemeIds.forEach(memeId => {
        const invalidData = {
          action: 'like',
          memeId,
          telegramId: 'user123'
        };
        const { error } = schema.validate(invalidData);
        expect(error).toBeDefined();
      });
    });

    test('Optional username field', () => {
      const validData = {
        action: 'like',
        memeId: 123,
        telegramId: 'user123',
        username: 'testuser'
      };
      const { error, value } = schema.validate(validData);
      expect(error).toBeUndefined();
      expect(value.username).toBe('testuser');
    });
  });

  describe('User Validation', () => {
    const schema = schemas.createUser;

    test('Valid user with all fields', () => {
      const validData = {
        telegramId: 'user123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User'
      };
      const { error } = schema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('Valid user with only required fields', () => {
      const validData = {
        telegramId: 'user123'
      };
      const { error } = schema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('Invalid telegramId types', () => {
      const invalidIds = [123, '', null, undefined, false];
      invalidIds.forEach(telegramId => {
        const invalidData = { telegramId };
        const { error } = schema.validate(invalidData);
        expect(error).toBeDefined();
      });
    });

    test('Extra unknown fields should be stripped', () => {
      const dataWithExtra = {
        telegramId: 'user123',
        unknownField: 'should be removed'
      };
      const { error, value } = schema.validate(dataWithExtra);
      expect(error).toBeUndefined();
      expect(value.unknownField).toBeUndefined();
    });
  });

  describe('Meme Validation', () => {
    const schema = schemas.createMeme;

    test('Valid meme with minimum required fields', () => {
      const validData = {
        id: 1,
        projectName: 'Test Project',
        content: 'https://example.com/meme.jpg',
        projectDetails: {
          network: 'Solana',
          price: '1.23'
        }
      };
      const { error } = schema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('Valid meme with all optional fields', () => {
      const validData = {
        id: 1,
        projectName: 'Test Project',
        content: 'https://example.com/meme.jpg',
        weight: 2,
        projectDetails: {
          type: 'Gaming',
          network: 'Solana',
          price: '1.23',
          marketCap: 1000000,
          priceChange24h: 5.5,
          contract: '0x123',
          website: 'https://example.com',
          twitter: '@example',
          telegram: '@example_group'
        }
      };
      const { error } = schema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('Invalid URLs', () => {
      const invalidUrls = ['not-a-url', '', 'http://', 'ftp://invalid'];
      invalidUrls.forEach(website => {
        const invalidData = {
          id: 1,
          projectName: 'Test',
          content: 'https://example.com/meme.jpg',
          projectDetails: {
            network: 'Solana',
            price: '1.23',
            website
          }
        };
        const { error } = schema.validate(invalidData);
        expect(error).toBeDefined();
      });
    });

    test('Invalid project types', () => {
      const invalidTypes = ['Invalid', 'MEME', 'game', '', null];
      invalidTypes.forEach(type => {
        const invalidData = {
          id: 1,
          projectName: 'Test',
          content: 'https://example.com/meme.jpg',
          projectDetails: {
            type,
            network: 'Solana',
            price: '1.23'
          }
        };
        const { error } = schema.validate(invalidData);
        expect(error).toBeDefined();
      });
    });
  });

  describe('Task Validation', () => {
    const schema = schemas.createTask;

    test('Valid task with minimum fields', () => {
      const validData = {
        projectId: '123',
        type: 'social',
        action: 'visit',
        points: 10,
        requirements: {
          platform: 'telegram'
        }
      };
      const { error } = schema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('Invalid points values', () => {
      const invalidPoints = [-1, 0, null, undefined, 'ten'];
      invalidPoints.forEach(points => {
        const invalidData = {
          projectId: '123',
          type: 'social',
          action: 'visit',
          points,
          requirements: {
            platform: 'telegram'
          }
        };
        const { error } = schema.validate(invalidData);
        expect(error).toBeDefined();
      });
    });

    test('Invalid platform types', () => {
      const invalidPlatforms = ['facebook', '', null, 123];
      invalidPlatforms.forEach(platform => {
        const invalidData = {
          projectId: '123',
          type: 'social',
          action: 'visit',
          points: 10,
          requirements: { platform }
        };
        const { error } = schema.validate(invalidData);
        expect(error).toBeDefined();
      });
    });

    test('Default values are set', () => {
      const minimalData = {
        projectId: '123',
        type: 'social',
        action: 'visit',
        points: 10,
        requirements: {
          platform: 'telegram'
        }
      };
      const { error, value } = schema.validate(minimalData);
      expect(error).toBeUndefined();
      expect(value.requirements.verificationMethod).toBe('click');
      expect(value.status).toBe('active');
    });
  });

  describe('Referral Validation', () => {
    const schema = schemas.redeemReferral;

    test('Valid referral with optional username', () => {
      const validData = {
        referralCode: 'CODE123',
        newUserTelegramId: 'user123',
        username: 'newuser'
      };
      const { error } = schema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('Valid referral without username', () => {
      const validData = {
        referralCode: 'CODE123',
        newUserTelegramId: 'user123'
      };
      const { error } = schema.validate(validData);
      expect(error).toBeUndefined();
    });

    test('Invalid or empty values', () => {
      const invalidData = [
        { referralCode: '', newUserTelegramId: 'user123' },
        { referralCode: 'CODE123', newUserTelegramId: '' },
        { referralCode: null, newUserTelegramId: 'user123' },
        { referralCode: 'CODE123', newUserTelegramId: null },
        { referralCode: 123, newUserTelegramId: 'user123' },
        { referralCode: 'CODE123', newUserTelegramId: 123 }
      ];

      invalidData.forEach(data => {
        const { error } = schema.validate(data);
        expect(error).toBeDefined();
      });
    });
  });

  describe('Leaderboard Validation', () => {
    const schema = schemas.getLeaderboard;

    test('Valid query parameters', () => {
      const validQueries = [
        { type: 'all', limit: 50 },
        { type: 'users', limit: 10 },
        { type: 'projects', limit: 100 },
        {} // Should use defaults
      ];

      validQueries.forEach(query => {
        const { error, value } = schema.validate(query);
        expect(error).toBeUndefined();
        expect(value.type).toBeDefined();
        expect(value.limit).toBeDefined();
      });
    });

    test('Invalid query parameters', () => {
      const invalidQueries = [
        { type: 'invalid' },
        { limit: 0 },
        { limit: 101 },
        { limit: -1 },
        { type: 123 },
        { type: 'all', limit: 'fifty' }
      ];

      invalidQueries.forEach(query => {
        const { error } = schema.validate(query);
        expect(error).toBeDefined();
      });
    });
  });
});