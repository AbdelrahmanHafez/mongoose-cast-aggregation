1.0.0 / 2026-02-05
===================
 * See [migration guide](docs/migrating_to_1.md) for details on upgrading from 0.x.
 * BREAKING: minimum mongoose version is now 8.0.0 (previously >= 5.x)
 * BREAKING: minimum Node.js version is now 18
 * feat: rewrite in TypeScript with full type declarations
 * feat: dual ESM and CommonJS support
 * feat: supports mongoose 8.x and 9.x
 * chore: migrate from Travis CI to GitHub Actions
 * chore: replace mocha with Jest
 * chore: use mongodb-memory-server for tests (no external MongoDB required)
 * chore: add Dependabot for automated dependency updates
 * chore: add CI-based npm publishing with OIDC trusted publishing

0.3.1 / 2022-07-07
===================
 * docs: add `$search` and `$searchMeta` to README for NPM homepage.

0.3.0 / 2022-07-06
===================
 * fix: allow casting stages after `$search` and `$searchMeta` re #11
 
0.2.1 / 2021-11-15
===================
 * fix: use mongoose version >= 5.x instead of a specific version

0.2.0 / 2021-09-09
===================
 * fix: add support for mongoose v6.x

0.1.0 / 2020-05-30
===================
 * feat: cast query on `$geoNear` stages #3
