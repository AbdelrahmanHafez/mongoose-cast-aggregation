import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import castAggregationPlugin from '../src/index.js';

const { Schema } = mongoose;

let mongoServer: MongoMemoryServer;

beforeAll(async function () {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  await mongoose.connection.dropDatabase();
});

afterAll(async function () {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(function () {
  mongoose.deleteModel(/.*/);
});

describe('castAggregationPlugin', function () {
  it('is a function', function () {
    expect(typeof castAggregationPlugin).toBe('function');
  });

  it('casts first stage when it is $match', async function () {
    // Arrange
    const { User } = createTestContext();
    const user = await User.create({ age: '25', expiresAt: Date.now() });

    // Act
    const results = await User.aggregate([
      { $match: { _id: user._id.toString(), age: '25' } }
    ]);

    // Assert
    expect(results[0]._id.toString()).toBe(user._id.toString());
  });

  it('casts $match after $sort', async function () {
    // Arrange
    const { User } = createTestContext();
    const user = await User.create({ age: '25', expiresAt: Date.now() });

    // Act
    const results = await User.aggregate([
      { $sort: { age: -1 } },
      { $match: { _id: user._id.toString(), age: '25' } }
    ]);

    // Assert
    expect(results[0]._id.toString()).toBe(user._id.toString());
  });

  it('casts multiple sequential $match stages', async function () {
    // Arrange
    const { User } = createTestContext();
    const user = await User.create({ age: '25', expiresAt: Date.now() });

    // Act
    const results = await User.aggregate([
      { $match: { age: '25' } },
      { $match: { _id: user._id.toString() } }
    ]);

    // Assert
    expect(results[0]._id.toString()).toBe(user._id.toString());
  });

  function createTestContext () {
    const userSchema = new Schema({ expiresAt: Date, age: Number });
    userSchema.plugin(castAggregationPlugin);
    const User = mongoose.model('User', userSchema);
    return { User };
  }
});