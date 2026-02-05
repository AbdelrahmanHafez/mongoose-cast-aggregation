import { Schema } from 'mongoose';
import castPipeline from './cast-pipeline.js';

export default function castAggregationPlugin (schema: Schema) {
  schema.pre('aggregate', function () {
    const pipeline = this.pipeline();
    castPipeline(this.model(), pipeline);
  });
}