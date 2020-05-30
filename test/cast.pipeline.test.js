const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { Schema } = mongoose;


const assert = require('assert');
const castPipeline = require('../lib/cast.pipeline');

beforeEach(function () {
  mongoose.deleteModel(/.*/);
});

describe('castPipeline(...)', function () {
  it('casts first stage when it is $match', function () {
    // Arrange
    const User = mongoose.model('User', { age: Number });

    const stringifiedAge = '25';

    const pipeline = [
      { $match: { _id: ObjectId().toString(), age: stringifiedAge } }
    ];

    // Act
    castPipeline(User, pipeline);

    // Assert
    assert.ok(pipeline[0].$match._id instanceof ObjectId);
    assert.equal(typeof pipeline[0].$match.age, 'number');
  });

  describe('casts $match when it comes after a stage that does not change projection', () => {

    it('$sort', function () {
      // Arrange
      const User = mongoose.model('User', { age: Number });

      const stringifiedAge = '25';
      const pipeline = [
        { $sort: { age: -1 } },
        { $match: { _id: ObjectId().toString(), age: stringifiedAge } }
      ];

      // Act
      castPipeline(User, pipeline);

      // Assert
      assert.ok(pipeline[1].$match._id instanceof ObjectId);
      assert.equal(typeof pipeline[1].$match.age, 'number');
    });

    it('$match', function () {
      // Arrange
      const discountSchema = new Schema({
        expiresAt: Date,
        age: Number
      });

      const Discount = mongoose.model('Discount', discountSchema);
      const expiresAtTimestamp = Date.now();
      const stringifiedAge = '25';

      const pipeline = [
        { $match: { age: stringifiedAge } },
        { $match: { expiresAt: expiresAtTimestamp } }
      ];

      // Act
      castPipeline(Discount, pipeline);

      // Assert
      assert.equal(typeof pipeline[0].$match.age, 'number');
      assert.ok(pipeline[1].$match.expiresAt instanceof Date);
    });
  });

  describe('$geoNear', function () {
    it('casts query on $geoNear', function () {
      // Arrange
      const User = mongoose.model('User', { age: Number });

      const pipeline = [
        { $geoNear: { query: { age: '25' } } }
      ];

      // Act
      castPipeline(User, pipeline);

      // Assert
      assert.equal(typeof pipeline[0].$geoNear.query.age, 'number');
    });

    it('stops casting after $geoNear', function () {
      // Arrange
      const Discount = mongoose.model('Discount', { amount: Number, expiresAt: Date });

      const pipeline = [
        { $geoNear: { query: { amount: '25' } } },
        { $match: { expiresAt: Date.now() } }
      ];

      // Act
      castPipeline(Discount, pipeline);

      // Assert
      assert.ok(typeof pipeline[0].$geoNear.query.amount === 'number');
      assert.ok(typeof pipeline[1].$match.expiresAt === 'number');
    });
  });
});