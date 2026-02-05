import { Query, Model, PipelineStage } from 'mongoose';

type CastFn = (model: Model<unknown>, filter: Record<string, unknown>) => Record<string, unknown>;
const QueryConstructor = Query as unknown as new () => { cast: CastFn };
const query = new QueryConstructor();

const stagesThatDoNotAffectProjection = new Set(
  ['$match', '$limit', '$sort', '$skip', '$sample', '$search', '$searchMeta']
);

export default function castPipeline (model: Model<unknown>, pipeline: PipelineStage[]) {
  for (const stage of pipeline) {
    if ('$geoNear' in stage && stage.$geoNear.query) {
      castFilter(model, stage.$geoNear.query);
    }

    const stageName = Object.keys(stage)[0];
    if (!stagesThatDoNotAffectProjection.has(stageName)) {
      return;
    }

    if ('$match' in stage) {
      stage.$match = castFilter(model, stage.$match);
    }
  }
}

function castFilter (model: Model<unknown>, filter: Record<string, unknown>) {
  return query.cast(model, filter);
}