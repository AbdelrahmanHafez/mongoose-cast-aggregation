const mongoose = require('mongoose');
const { Schema } = mongoose;
const aggregationCastPlugin = require('../index');
const assert = require('assert');

mongoose.connect('mongodb://127.0.0.1/mongoose_aggregation_cast_test', { useFindAndModify: true, useNewUrlParser: true, useUnifiedTopology: true });


const userSchema = new Schema({
  expiresAt: Date,
  age: Number
});

userSchema.plugin(aggregationCastPlugin);

const User = mongoose.model('User', userSchema);

describe('aggregationCastPlugin', function () {

  this.beforeAll(async function () {
    await mongoose.connection.dropDatabase();
  });

  it('is a function', () => {
    assert.equal(typeof aggregationCastPlugin, 'function');
  });

  it('casts first stage when it is $match', async function () {
    // Arrange
    const expiresAtTimestamp = Date.now();
    const stringifiedAge = '25';

    const user = await User.create({ age: stringifiedAge, expiresAt: expiresAtTimestamp });

    // Act
    const usersFromAggregation = await User.aggregate([
      { $match: { _id: user._id.toString(), age: stringifiedAge } }
    ]);

    // Assert
    assert.equal(usersFromAggregation[0]._id.toString(), user._id.toString());
  });

  describe('casts $match when it comes after a stage that changes projection', () => {

    it('$sort', async function () {
      // Arrange
      const expiresAtTimestamp = Date.now();
      const stringifiedAge = '25';

      const user = await User.create({ age: stringifiedAge, expiresAt: expiresAtTimestamp });

      // Act
      const usersFromAggregation = await User.aggregate([
        { $sort: { age: -1 } },
        { $match: { _id: user._id.toString(), age: stringifiedAge } }
      ]);

      // Assert
      assert.equal(usersFromAggregation[0]._id.toString(), user._id.toString());
    });

    it('$match', async function () {
      // Arrange
      const expiresAtTimestamp = Date.now();
      const stringifiedAge = '25';

      const user = await User.create({ age: stringifiedAge, expiresAt: expiresAtTimestamp });

      // Act
      const usersFromAggregation = await User.aggregate([
        { $match: { age: stringifiedAge } },
        { $match: { _id: user._id.toString() } }
      ]);

      // Assert
      assert.equal(usersFromAggregation[0]._id.toString(), user._id.toString());
    });
  });


});