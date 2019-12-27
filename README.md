# Mongoose Cast Aggregation

A mongoose plugin that casts aggregation pipelines whenever possible.

## Getting Started
**At the time of this writing, the package is not published on NPM yet. For testing purposes, clone the repo locally and use it. The package will be published on NPM soon.**


run
```
npm install mongoose-cast-aggregation
```

Add the plugin into your schema:
```js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const castAggregation = require('mongoose-cast-aggregation');

const discountSchema = new Schema({
  expiresAt: Date,
  amount: Number
});

discountSchema.plugin(castAggregation);

const Discount = mongoose.model('Discount', discountSchema);
```


### Prerequisites

The plugin is tested on Node 12.13.0, MongoDB 4.2, and mongoose v5.8.3.
Planning to make it backwards-comptaible in the future.


### Installing

run 
```
npm install mongoose-cast-aggregation-match
```

Add the plugin:

```js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const castAggregation = require('mongoose-cast-aggregation');

const discountSchema = new Schema({
  expiresAt: Date,
  amount: Number
});

discountSchema.plugin(castAggregation);

const Discount = mongoose.model('Discount', discountSchema);
```

Now mongoose will cast the `$match` stage whenever possible. It casts the `$match` stage as long as no stage before it changed the resulting document shape from the original schema (e.g. `$sort`, `$skip`, and `$match`).

```js
const discounts = await Discount.aggregate([
  // Will cast the amount to a number, and the timestamp to a date object
  { $match: { expiresAt: { $lt: Date.now() }, amount: '20' } }
]);
```

This works as well:

```js
const discounts = await Discount.aggregate([
  { $sort: { amount:-1 } },
  { $skip: 20 },
  // Will cast the stage below to a date object, because the document shape hasn't changed yet.
  { $match: { expiresAt: { $lt: Date.now() } } },

  // Will cast this one to numbers as well.
  { $match: { amount: { $gt: '80', $lt: '200' } } },
  { $project: { amountInUSD: '$amount' } },

  // Will ***NOT*** cast this one, because we used a stage that changed the shape of the document.
  // so using the string '100' here will not work, will have to use the correct type of number in order to get results.
  { $match: { amountInUSD: { $gt: 100 } } }
]);
```