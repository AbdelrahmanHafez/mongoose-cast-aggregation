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
    const { Product } = createTestContext();
    const pipeline: PipelineStage[] = [
      { $match: { _id: new ObjectId().toString(), price: '25' } }
    ];

    // Act
    castPipeline(Product, pipeline);

    // Assert
    const stage = pipeline[0] as PipelineStage.Match;
    expect(stage.$match._id).toBeInstanceOf(ObjectId);
    expect(typeof stage.$match.price).toBe('number');
  });

  describe('casts $match when it comes after a stage that does not change projection', function () {
    it('$sort', function () {
      // Arrange
      const { Product } = createTestContext();
      const pipeline: PipelineStage[] = [
        { $sort: { price: -1 } },
        { $match: { _id: new ObjectId().toString(), price: '25' } }
      ];

      // Act
      castPipeline(Product, pipeline);

      // Assert
      const stage = pipeline[1] as PipelineStage.Match;
      expect(stage.$match._id).toBeInstanceOf(ObjectId);
      expect(typeof stage.$match.price).toBe('number');
    });

    it('$match', function () {
      // Arrange
      const { Product } = createTestContext();
      const listedAtTimestamp = Date.now();
      const pipeline: PipelineStage[] = [
        { $match: { price: '25' } },
        { $match: { listedAt: listedAtTimestamp } }
      ];

      // Act
      castPipeline(Product, pipeline);

      // Assert
      const first = pipeline[0] as PipelineStage.Match;
      const second = pipeline[1] as PipelineStage.Match;
      expect(typeof first.$match.price).toBe('number');
      expect(second.$match.listedAt).toBeInstanceOf(Date);
    });

    it('$search', function () {
      // Arrange
      const { Product } = createTestContext();
      const listedAtTimestamp = Date.now();
      const pipeline: PipelineStage[] = [
        { $search: { index: 'default', text: { query: '25', path: 'price' } } },
        { $match: { price: '25' } },
        { $match: { listedAt: listedAtTimestamp } }
      ];

      // Act
      castPipeline(Product, pipeline);

      // Assert
      const second = pipeline[1] as PipelineStage.Match;
      const third = pipeline[2] as PipelineStage.Match;
      expect(typeof second.$match.price).toBe('number');
      expect(third.$match.listedAt).toBeInstanceOf(Date);
    });

    it('$searchMeta', function () {
      // Arrange
      const { Product } = createTestContext();
      const listedAtTimestamp = Date.now();
      const pipeline: PipelineStage[] = [
        { $searchMeta: { index: 'default', text: { query: '25', path: 'price' } } },
        { $match: { price: '25' } },
        { $match: { listedAt: listedAtTimestamp } }
      ];

      // Act
      castPipeline(Product, pipeline);

      // Assert
      const second = pipeline[1] as PipelineStage.Match;
      const third = pipeline[2] as PipelineStage.Match;
      expect(typeof second.$match.price).toBe('number');
      expect(third.$match.listedAt).toBeInstanceOf(Date);
    });
  });

  it('casts $elemMatch in $match', function () {
    // Arrange
    const { Product } = createTestContext();
    const authorId = new ObjectId();
    const pipeline: PipelineStage[] = [
      { $match: { reviews: { $elemMatch: { rating: '5', authorId: authorId.toString() } } } }
    ];

    // Act
    castPipeline(Product, pipeline);

    // Assert
    const stage = pipeline[0] as PipelineStage.Match;
    const elemMatch = stage.$match.reviews.$elemMatch;
    expect(typeof elemMatch.rating).toBe('number');
    expect(elemMatch.authorId).toBeInstanceOf(ObjectId);
  });

  describe('$geoNear', function () {
    it('casts query on $geoNear', function () {
      // Arrange
      const { Product } = createTestContext();
      const pipeline: PipelineStage[] = [
        { $geoNear: { near: { type: 'Point', coordinates: [0, 0] }, distanceField: 'dist', query: { price: '25' } } }
      ];

      // Act
      castPipeline(Product, pipeline);

      // Assert
      const stage = pipeline[0] as PipelineStage.GeoNear;
      expect(typeof stage.$geoNear.query!.price).toBe('number');
    });

    it('stops casting after $geoNear', function () {
      // Arrange
      const { Product } = createTestContext();
      const pipeline: PipelineStage[] = [
        { $geoNear: { near: { type: 'Point', coordinates: [0, 0] }, distanceField: 'dist', query: { price: '25' } } },
        { $match: { listedAt: Date.now() } }
      ];

      // Act
      castPipeline(Product, pipeline);

      // Assert
      const geoNear = pipeline[0] as PipelineStage.GeoNear;
      const match = pipeline[1] as PipelineStage.Match;
      expect(typeof geoNear.$geoNear.query!.price).toBe('number');
      expect(typeof match.$match.listedAt).toBe('number');
    });
  });

  function createTestContext () {
    const Product = mongoose.model('Product', new Schema({
      price: Number,
      listedAt: Date,
      reviews: [{ rating: Number, authorId: Schema.Types.ObjectId }]
    }));
    return { Product };
  }
});