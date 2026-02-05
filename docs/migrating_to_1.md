# Migrating to v1.0.0

## Breaking Changes

### Minimum mongoose version is now 8.0.0

The peer dependency changed from `mongoose >= 5.x` to `mongoose >= 8.0.0`. If you are on mongoose 5, 6, or 7, you must upgrade mongoose before upgrading this plugin.

### Dropped Node.js < 18

Node.js 18 is the minimum supported version.

## What's New

### Rewritten in TypeScript

The entire codebase has been rewritten in TypeScript with full type declarations shipped in the package. Your editor will now provide autocomplete and type checking when using the plugin.

### Dual ESM and CommonJS support

The package now ships both ESM and CommonJS builds. Import it however your project is set up:

**ESM:**

```js
import mongoose from 'mongoose';
import castAggregation from 'mongoose-cast-aggregation';

mongoose.plugin(castAggregation);
```

**CommonJS:**

```js
const mongoose = require('mongoose');
const castAggregation = require('mongoose-cast-aggregation');

mongoose.plugin(castAggregation);
```

Both produce the same result. The `require()` call returns the plugin function directly, same as v0.x.

### Supports mongoose 8.x and 9.x

Tested against both mongoose 8.x and 9.x in CI.