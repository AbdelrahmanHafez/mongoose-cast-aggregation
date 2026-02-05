import mongoose, { PipelineStage } from 'mongoose';
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
    const { Product } = createTestContext();
    const product = await Product.create({ price: 25, listedAt: new Date() });

    // Act
    const pipeline: PipelineStage[] = [
      { $match: { _id: product._id.toString(), price: '25' } }
    ];
    const results = await Product.aggregate(pipeline);

    // Assert
    expect(results[0]._id.toString()).toBe(product._id.toString());
  });

  it('casts $match after $sort', async function () {
    // Arrange
    const { Product } = createTestContext();
    const product = await Product.create({ price: 25, listedAt: new Date() });

    // Act
    const pipeline: PipelineStage[] = [
      { $sort: { price: -1 } },
      { $match: { _id: product._id.toString(), price: '25' } }
    ];
    const results = await Product.aggregate(pipeline);

    // Assert
    expect(results[0]._id.toString()).toBe(product._id.toString());
  });

  it('casts multiple sequential $match stages', async function () {
    // Arrange
    const { Product } = createTestContext();
    const product = await Product.create({ price: 25, listedAt: new Date() });

    // Act
    const pipeline: PipelineStage[] = [
      { $match: { price: '25' } },
      { $match: { _id: product._id.toString() } }
    ];
    const results = await Product.aggregate(pipeline);

    // Assert
    expect(results[0]._id.toString()).toBe(product._id.toString());
  });

  it('casts $elemMatch in $match', async function () {
    // Arrange
    const { Product } = createTestContext();
    const authorId = new mongoose.Types.ObjectId();
    const product = await Product.create({ price: 25, listedAt: new Date(), reviews: [{ rating: 5, authorId }] });

    // Act
    const pipeline: PipelineStage[] = [
      { $match: { reviews: { $elemMatch: { rating: '5', authorId: authorId.toString() } } } }
    ];
    const results = await Product.aggregate(pipeline);

    // Assert
    expect(results).toHaveLength(1);
    expect(results[0]._id.toString()).toBe(product._id.toString());
  });

  function createTestContext () {
    const productSchema = new Schema({
      price: Number,
      listedAt: Date,
      reviews: [{ rating: Number, authorId: Schema.Types.ObjectId }]
    });
    productSchema.plugin(castAggregationPlugin);
    const Product = mongoose.model('Product', productSchema);

    return { Product };
  }
});