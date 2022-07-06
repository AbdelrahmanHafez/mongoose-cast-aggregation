const { Query } = require('mongoose');
const mongooseQuery = new Query();

const stagesThatDoNotAffectProjection = Object.freeze(['$match', '$limit', '$sort', '$skip', '$sample', '$search', '$searchMeta']);

function castPipeline (model, pipeline) {
  for (const stage of pipeline) {
    const stageName = getStageName(stage);

    if (stageName === '$geoNear' && stage.$geoNear.query) {
      castFilter(model, stage.$geoNear.query);
    }

    const projectionHasChanged = !stagesThatDoNotAffectProjection.includes(stageName);
    if (projectionHasChanged) {
      return;
    }

    if (stageName === '$match') stage[stageName] = castFilter(model, stage[stageName]);
  }
}

function getStageName (stage) {
  return Object.keys(stage)[0];
}

function castFilter (Model, filter) {
  return mongooseQuery.cast(Model, filter);
}

module.exports = castPipeline;