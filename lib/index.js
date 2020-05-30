const castPipeline = require('./cast.pipeline');

function castAggregationPlugin (schema) {
  schema.pre('aggregate', function () {
    const pipeline = this.pipeline();

    castPipeline(this._model, pipeline);
  });
}

module.exports = castAggregationPlugin;