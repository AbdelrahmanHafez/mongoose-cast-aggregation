const { Query } = require('mongoose');
const mongooseQuery = new Query();

const pipelinesThatDoNotAffectProjection = Object.freeze(['$match', '$sort', '$skip']);

function aggregationCastPlugin (schema) {
  schema.pre('aggregate', function (next) {
    const pipeline = this.pipeline();


    for (let i = 0; i < pipeline.length; i++) {
      const stage = pipeline[i];
      const stageName = getStageName(stage);

      const projectionHasChanged = !pipelinesThatDoNotAffectProjection.includes(stageName);
      if (projectionHasChanged) return next();

      if (stageName === '$match') pipeline[i][stageName] = castFilter(this._model, pipeline[i][stageName]);
    }

    next();
  });
}

function getStageName (stage) {
  return Object.keys(stage)[0];
}

function castFilter (Model, filter) {
  return mongooseQuery.cast(Model, filter);
}

module.exports = aggregationCastPlugin;