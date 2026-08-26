# Contributing

Thanks for helping. A few ground rules keep this repo honest and easy to release.

## Setup

1. Install Node 18+ and pnpm 9+ (`corepack enable`).
2. `pnpm install`
3. `pnpm build` then `pnpm test` — both must pass before you start.

## Ground rules

- The documented Google SDK surface is `init({ theme, lang })` and `addPreferredSource()`. Nothing else exists. Pull requests that pass undocumented options, or that present click events as conversions, will be declined.
- British English in docs, comments and identifiers we control.
- Every change to a publishable package needs a changeset: `pnpm changeset`.
- New behaviour needs a test. Core coverage stays at or above 90% of lines.

## Workflow

1. Branch from `main`.
2. Make the change; run `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test`.
3. Add a changeset describing the change from a consumer's point of view.
4. Open a pull request. CI must pass.

Releases are automated: the Changesets bot opens a "Version Packages" PR, and merging it publishes to npm.
