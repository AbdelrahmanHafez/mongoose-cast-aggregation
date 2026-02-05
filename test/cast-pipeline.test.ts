import mongoose, { PipelineStage } from 'mongoose';
import castPipeline from '../src/cast-pipeline.js';

const { ObjectId } = mongoose.Types;
const { Schema } = mongoose;

beforeEach(function () {
  mongoose.deleteModel(/.*/);
});

describe('castPipeline(...)', function () {
  it('casts first stage when it is $match', function () {
    // Arrange
    const { User } = createTestContext();
    const pipeline: PipelineStage[] = [
      { $match: { _id: new ObjectId().toString(), age: '25' } }
    ];

    // Act
    castPipeline(User, pipeline);

    // Assert
    const stage = pipeline[0] as PipelineStage.Match;
    expect(stage.$match._id).toBeInstanceOf(ObjectId);
    expect(typeof stage.$match.age).toBe('number');
  });

  describe('casts $match when it comes after a stage that does not change projection', function () {
    it('$sort', function () {
      // Arrange
      const { User } = createTestContext();
      const pipeline: PipelineStage[] = [
        { $sort: { age: -1 } },
        { $match: { _id: new ObjectId().toString(), age: '25' } }
      ];

      // Act
      castPipeline(User, pipeline);

      // Assert
      const stage = pipeline[1] as PipelineStage.Match;
      expect(stage.$match._id).toBeInstanceOf(ObjectId);
      expect(typeof stage.$match.age).toBe('number');
    });

    it('$match', function () {
      // Arrange
      const { Discount } = createTestContext();
      const expiresAtTimestamp = Date.now();
      const pipeline: PipelineStage[] = [
        { $match: { age: '25' } },
        { $match: { expiresAt: expiresAtTimestamp } }
      ];

      // Act
      castPipeline(Discount, pipeline);

      // Assert
      const first = pipeline[0] as PipelineStage.Match;
      const second = pipeline[1] as PipelineStage.Match;
      expect(typeof first.$match.age).toBe('number');
      expect(second.$match.expiresAt).toBeInstanceOf(Date);
    });

    it('$search', function () {
      // Arrange
      const { Discount } = createTestContext();
      const expiresAtTimestamp = Date.now();
      const pipeline: PipelineStage[] = [
        { $search: { index: 'default', text: { query: '25', path: 'age' } } },
        { $match: { age: '25' } },
        { $match: { expiresAt: expiresAtTimestamp } }
      ];

      // Act
      castPipeline(Discount, pipeline);

      // Assert
      const second = pipeline[1] as PipelineStage.Match;
      const third = pipeline[2] as PipelineStage.Match;
      expect(typeof second.$match.age).toBe('number');
      expect(third.$match.expiresAt).toBeInstanceOf(Date);
    });

    it('$searchMeta', function () {
      // Arrange
      const { Discount } = createTestContext();
      const expiresAtTimestamp = Date.now();
      const pipeline: PipelineStage[] = [
        { $searchMeta: { index: 'default', text: { query: '25', path: 'age' } } },
        { $match: { age: '25' } },
        { $match: { expiresAt: expiresAtTimestamp } }
      ];

      // Act
      castPipeline(Discount, pipeline);

      // Assert
      const second = pipeline[1] as PipelineStage.Match;
      const third = pipeline[2] as PipelineStage.Match;
      expect(typeof second.$match.age).toBe('number');
      expect(third.$match.expiresAt).toBeInstanceOf(Date);
    });
  });

  describe('$geoNear', function () {
    it('casts query on $geoNear', function () {
      // Arrange
      const { User } = createTestContext();
      const pipeline: PipelineStage[] = [
        { $geoNear: { near: { type: 'Point', coordinates: [0, 0] }, distanceField: 'dist', query: { age: '25' } } }
      ];

      // Act
      castPipeline(User, pipeline);

      // Assert
      const stage = pipeline[0] as PipelineStage.GeoNear;
      expect(typeof stage.$geoNear.query!.age).toBe('number');
    });

    it('stops casting after $geoNear', function () {
      // Arrange
      const { Discount } = createTestContext();
      const pipeline: PipelineStage[] = [
        { $geoNear: { near: { type: 'Point', coordinates: [0, 0] }, distanceField: 'dist', query: { amount: '25' } } },
        { $match: { expiresAt: Date.now() } }
      ];

      // Act
      castPipeline(Discount, pipeline);

      // Assert
      const geoNear = pipeline[0] as PipelineStage.GeoNear;
      const match = pipeline[1] as PipelineStage.Match;
      expect(typeof geoNear.$geoNear.query!.amount).toBe('number');
      expect(typeof match.$match.expiresAt).toBe('number');
    });
  });

  function createTestContext () {
    const User = mongoose.model('User', new Schema({ age: Number }));
    const Discount = mongoose.model('Discount', new Schema({
      amount: Number,
      expiresAt: Date,
      age: Number
    }));
    return { User, Discount };
  }
});